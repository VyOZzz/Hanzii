const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

function parseProperties(content) {
  const map = {};
  const lines = content.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    map[key] = value;
  }
  return map;
}

function extractDbConfig(props) {
  const jdbc = props['spring.datasource.url'] || '';
  const match = jdbc.match(/^jdbc:mysql:\/\/([^:/?#]+)(?::(\d+))?\/([^?]+)/i);
  if (!match) throw new Error(`Cannot parse spring.datasource.url: ${jdbc}`);

  const host = process.env.DB_HOST || match[1];
  const port = Number(process.env.DB_PORT || match[2] || 3306);
  const database = process.env.DB_NAME || match[3];
  const user = process.env.DB_USER || props['spring.datasource.username'];
  const password = process.env.DB_PASSWORD || props['spring.datasource.password'];

  if (!user) throw new Error('Missing DB username');
  if (password == null) throw new Error('Missing DB password');

  return { host, port, database, user, password };
}

async function classifyWithGemini(apiKey, apiUrl, word) {
  const payload = {
    systemInstruction: {
      role: 'user',
      parts: [
        {
          text:
            'Ban la chuyen gia phan trinh do HSK. Nhiem vu: dua ra mot so duy nhat tu 1 den 9 cho do kho tu vung. Chi tra ve mot ky tu so duy nhat, khong them giai thich.',
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              `Hay xep trinh do HSK cho tu sau:\n` +
              `Hanzi: ${word.hanzi || ''}\n` +
              `Pinyin: ${word.pinyin || ''}\n` +
              `Nghia tieng Viet: ${word.meaning || ''}\n\n` +
              'Chi tra ve mot so 1-9.',
          },
        ],
      },
    ],
  };

  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${text}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  const m = text.match(/\b([1-9])\b/);
  if (!m) return null;
  return Number(m[1]);
}

async function main() {
  const propsPath = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'application.properties');
  const propsContent = fs.readFileSync(propsPath, 'utf8');
  const props = parseProperties(propsContent);
  const db = extractDbConfig(props);

  const geminiApiKey = process.env.GEMINI_API_KEY || props['gemini.api.key'];
  const geminiApiUrl = process.env.GEMINI_API_URL || props['gemini.api.url'];

  if (!geminiApiKey || geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY in scratch/.env or application.properties');
  }
  if (!geminiApiUrl) {
    throw new Error('Missing Gemini API URL');
  }

  console.log('[INFO] DB host:', db.host, 'port:', db.port, 'database:', db.database, 'user:', db.user);
  console.log('[INFO] Fetching up to 100 words with hsk_level NULL or 0...');

  const conn = await mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    charset: 'utf8mb4',
  });

  try {
    const [tableRows] = await conn.execute(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = ?
         AND table_name IN ('word', 'words')
       LIMIT 1`,
      [db.database],
    );

    if (!tableRows.length) {
      throw new Error("Cannot find target table 'word' or 'words' in current schema");
    }

    const targetTable = tableRows[0].table_name || tableRows[0].TABLE_NAME || Object.values(tableRows[0])[0];
    console.log(`[INFO] Using table: ${targetTable}`);

    const [rows] = await conn.execute(
      `SELECT id, hanzi, pinyin, meaning
       FROM ${targetTable}
       WHERE hsk_level IS NULL OR hsk_level = 0
       ORDER BY id ASC
       LIMIT 100`
    );

    console.log(`[INFO] Found ${rows.length} candidate words.`);
    if (!rows.length) {
      console.log('[DONE] Nothing to update.');
      return;
    }

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const w = rows[i];
      try {
        const level = await classifyWithGemini(geminiApiKey, geminiApiUrl, w);
        if (!level || level < 1 || level > 9) {
          skipped += 1;
          console.log(`[SKIP] #${i + 1} id=${w.id} hanzi=${w.hanzi} -> invalid level`);
          continue;
        }

        await conn.execute(`UPDATE ${targetTable} SET hsk_level = ? WHERE id = ?`, [level, w.id]);
        success += 1;
        console.log(`[OK] #${i + 1} id=${w.id} hanzi=${w.hanzi} -> HSK ${level}`);
      } catch (err) {
        failed += 1;
        console.log(`[ERR] #${i + 1} id=${w.id} hanzi=${w.hanzi} -> ${err.message}`);
      }
    }

    console.log('------------------------------------');
    console.log(`[RESULT] total=${rows.length}, updated=${success}, skipped=${skipped}, failed=${failed}`);
    console.log('[DONE] HSK backfill process completed.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
