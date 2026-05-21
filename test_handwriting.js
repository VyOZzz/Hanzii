const payload = {
  input_type: 0,
  requests: [
    {
      language: 'zh',
      writing_guide: {
        writing_area_width: 300,
        writing_area_height: 300,
      },
      ink: [
        [
          [50, 100, 150, 200, 250], // x coords for a horizontal line
          [150, 150, 150, 150, 150] // y coords
        ]
      ],
    },
  ],
}

fetch('https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
.then(r => r.text())
.then(data => console.log('Response:', data))
.catch(err => console.error(err));
