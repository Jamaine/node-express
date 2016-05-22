const express = require('express');
const app = express();
const fs = require('fs');
const _ = require('lodash');
const engines = require('consolidate');

var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })

});

// Anytime we render something with an hbs extension, use the engines.handlebars object
app.engine('hbs', engines.handlebars);

app.set('views', './views');
// Set the default templating engine
app.set('view engine', 'hbs');

// allows us to serve static files from a directory
// app.use(express.static('images'))
// any urls referencing `/profilepics` will resolve to images
app.use('/profilepics', express.static('images'))

app.get('/', (req, res) => {
  // index will map to index.jade or whatever index file type we have specified in the view engine
  // we could specifically reference index.jade by typing that instead
  res.render('index', { users: users });
})


// ":" tells express that `username` is a path variable
// /:username could be domain/anything
app.get('/:username', (req, res) => {
  console.log(req.params)
  // req.params is given a username key - takes that name from the placeholder above and a property being the actual name of the url parameter
  // req.params = {username: the url parameter}
  const username = req.params.username;
  console.log(username)
  res.render('user', { username: username })
})

var server = app.listen(7200, () => {
  console.log('Server running at http://localhost:' + server.address().port)
});
