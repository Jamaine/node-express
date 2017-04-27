const express = require('express');
// creates a new instance of an express app.
const app = express();
const fs = require('fs');
const _ = require('lodash');

const users = [];

fs.readFile('users.json', { encoding: 'utf8' }, (err, data) => {
  if (err) throw err;

  JSON.parse(data).forEach(user => {
    user.name.full = _.startCase(`${user.name.first} ${user.name.last}`);
    users.push(user)
  })
})

// when express gets an http 'GET' request to the root path, call this function
app.get('/', (req, res) => {
  // create a list of users from the array of users
  const userList = users.reduce((list, user) => (
    list += `<a href="/${user.username}">${user.name.full}</a><br>`
  ), '');
  // prints it to the page
  res.send(userList)
})

// : indicates the following text is a path variable, whatever the pathename is from request.params.username in this case
// /:username adds username to req.params object, witha property of the variable pathename
// /:username /skinout = req.params = { username: 'skinout' }
app.get('/:username', (req, res) => {
  console.log(req.params);
  const username = req.params.username;
  res.send(username)
})

// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
