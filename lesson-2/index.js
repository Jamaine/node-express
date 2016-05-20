const express = require('express');
const app = express();
const fs = require('fs');
const _ = require('lodash');

var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })

})

app.get('/', (req, res) => {
  var buffer = '';
  users.forEach((user) => buffer += `<a href="/${user.username}">${user.name.full}</a> <br>`)
  res.send(buffer)
})

// using regex
app.get(/black.*/, (req, res, next) => {
  console.log('BLACK USER ACCESS')
  // next calls the next route handler - app.get('/:username')
  next()
})
// ":" tells express that `username` is a path variable
// /:username could be domain/anything
app.get('/:username', (req, res) => {
  console.log(req.params)
  // req.params is given a username key - takes that name from the placeholder above and a property being the actual name of the url parameter
  // req.params = {username: the url parameter}
  const username = req.params.username;
  res.send(username);
})

app.get('/yo', (req, res) => {
  res.send('YO!')
})

var server = app.listen(7200, () => {
  console.log('Server running at http://localhost:' + server.address().port)
});
