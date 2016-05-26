const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const bodyParser = require('body-parser');

// returns the .json file filepath for a specified user, based on their username
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

function verifyUser(request, response, next) {
  const filepath = getUserFilePath(request.params.username);
  // check if the file exists at filepath exists
  fs.exists(filepath, function(yes) {
    // returns boolean
    if(yes) {
      // if true go to next
      // next is the next function, in this case is the anonymous function after verifyUser is called
      next()
    } else {
      // redirect to our error route
      response.redirect('/error/' + request.params.username);
    }
  })
}

app.get('*.json', (request, response) => {
  //  allows us to download files, takes an optional second parameter, if you want to give the file a different name
  response.download(`./users/${request.path}`)
})

// sends json response to the browser
// useful for creating an api server
app.get('/data/:username', (request, response) => {
  const username = request.params.username;
  const user = getUser(username);
  response.json(user);
})

app.all('/:username', (req, res, next) => {
  console.log(req.method, 'for', req.params.username);
  next();
})

// ":" tells express that `username` is a path variable
// /:username could be domain/anything
app.get('/:username', verifyUser, (req, res) => {
  const username = req.params.username;
  const user = getUser(username);
  // The file user.hbs
  // Properties we want to be availble to the view
  res.render('user', {
    user: user,
    address: user.location
  })
})

//
app.get('/error/:username', (request, response) => {
  response.status(404) // optionally send a 404 status as a page response
    .send(`no user named ${request.params.username} found`)
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
