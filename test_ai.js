const message = `Hãy phân tích cấu trúc ngữ pháp, cách dùng của từ tiếng Trung sau đây (giải thích ngắn gọn, dễ hiểu), đồng thời đưa ra 2 câu ví dụ có phiên âm và dịch nghĩa.\nTừ: 作人\nPinyin: zuo4 ren2\nNghĩa: làm người`;

fetch('http://127.0.0.1:8081/api/ai/chat', {
  method: 'POST', 
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify({message})
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
