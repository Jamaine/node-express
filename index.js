const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const bodyParser = require('body-parser');

function getUserFilePath(username) {
  return path.join(__dirname, 'users', username) + '.json';
}

function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), { encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);

  _.keys(user.location).forEach(function(key) {
    user.location[key] = _.startCase(user.location[key]);
  });

  return user;
}

function saveUser(username, data) {
  const fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), { encoding: 'utf8'});
}

// Anytime we render something with an hbs extension, use the engines.handlebars object
app.engine('hbs', engines.handlebars);

app.set('views', './views');
// Set the default templating engine
app.set('view engine', 'hbs');

// allows us to serve static files from a directory
// app.use(express.static('images'))
// any urls referencing `/profilepics` will resolve to images
app.use('/profilepics', express.static('images'));
//
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  var users = []
  // reads all the files in our users directory
  fs.readdir('users', function (err, files) {
    // loop over the files
    files.forEach(function (file) {
      // parse out the data
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function (err, data) {
        var user = JSON.parse(data)
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
        users.push(user)
        // if we have the right number of users defined we will render the index page
        if (users.length === files.length) res.render('index', {users: users})
      })
    })
  })
})


// ":" tells express that `username` is a path variable
// /:username could be domain/anything
app.get('/:username', (req, res) => {
  const username = req.params.username;
  const user = getUser(username);
  // The file user.hbs
  // Properties we want to be availble to the view
  res.render('user', {
    user: user,
    address: user.location
  })
})

app.put('/:username', (req, res) => {
  const username = req.params.username;
  const user = getUser(username);
  // data object which is passed back from the form
  user.location = req.body;

  saveUser(username, user);
  // end the request
  res.end();
})

app.delete('/:username', (req, res) => {
  const fp = getUserFilePath(req.params.username);
  // deletes file
  fs.unlinkSync(fp);
  // send a 200 status back to the client
  res.sendStatus(200);
})

var server = app.listen(7200, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
