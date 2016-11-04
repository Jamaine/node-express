const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const JSONStream = require('JSONStream');

const User = require('./db').User


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

app.get('/favicon.ico', function (req, res) {
  res.end()
})

app.get('/', (req, res) => {
  User.find({}, function (err, users) {
    res.render('index', { users: users})
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
  const readable = fs.createReadStream(`./users/${username}.json`);
  // take data from readable and pipe it to the response
  readable.pipe(response);
});

app.get('/users/by/:gender', (request, response) => {
  const gender = request.params.gender;
  const readable = fs.createReadStream('users.json');

  readable
    // * everything in the file
    .pipe(JSONStream.parse('*', (user)=> {
      if (user.gender === gender) return user.name.last
    }))
    .pipe(JSONStream.stringify('[\n ', ',\n', '\n]\n' ))
    .pipe(response);
})

const userRouter = require('./username');
app.use('/:username', userRouter);


app.get('/error/:username', (request, response) => {
  response.status(404) // optionally send a 404 status as a page response
    .send(`no user named ${request.params.username} found`)
})



var server = app.listen(7200, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
