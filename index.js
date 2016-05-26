const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const helpers = require('./helpers');


console.log(helpers.getUser)

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



app.get('*.json', (request, response) => {
  //  allows us to download files, takes an optional second parameter, if you want to give the file a different name
  response.download(`./users/${request.path}`)
})

// sends json response to the browser
// useful for creating an api server
app.get('/data/:username', (request, response) => {
  const username = request.params.username;
  const user = helpers.getUser(username);
  response.json(user);
});

const userRouter = require('./username');
app.use('/:username', userRouter);


app.get('/error/:username', (request, response) => {
  response.status(404) // optionally send a 404 status as a page response
    .send(`no user named ${request.params.username} found`)
})



var server = app.listen(7200, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
