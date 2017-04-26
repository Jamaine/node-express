const express = require('express');
// creates a new instance of an express app.
const app = express();

// when express gets an http 'GET' request to the root path, call this function
app.get('/', (request, result) => {
  result.send('Hello, World')
})

app.get('/yo', (req, res) => {
  res.send('YO!')
})

// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
