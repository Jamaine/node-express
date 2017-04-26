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
app.get('/', (request, res) => {
  const buffer = users.reduce((acc, user) => {
    acc += `${user.name.full}<br>`
    return acc;
  }, '');
  res.send(buffer)
})

// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
