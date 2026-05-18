const fs = require('fs');
const mysql = require('mysql2/promise');

function parse(content) {
  const map = {};
  for (const lineRaw of content.split(/\r?\n/)) {
    const line = lineRaw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    map[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return map;
}

async function main() {
  const props = parse(fs.readFileSync('../backend/src/main/resources/application.properties', 'utf8'));
  const jdbc = props['spring.datasource.url'];
  const m = jdbc.match(/^jdbc:mysql:\/\/([^:/?#]+)(?::(\d+))?\/([^?]+)/i);
  const conn = await mysql.createConnection({
    host: m[1],
    port: Number(m[2] || 3306),
    user: props['spring.datasource.username'],
    password: props['spring.datasource.password'],
    database: m[3],
  });
  const [rows] = await conn.query('SHOW TABLES');
  console.log(rows);
  await conn.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
