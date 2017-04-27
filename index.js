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

// adds support for template engines
//  when rendering a view look in the view directory
app.set('views', './views')
//  use the jade view engine
app.set('view engine', 'jade')

// when express gets an http 'GET' request to the root path, call this function
app.get('/', (req, res) => {
  res.render('index', { users: users })
})

app.get(/big.*/, (req, res, next) => {
  console.log('big user access');
  next();
})


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
