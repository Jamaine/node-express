const express = require('express');
// creates a new instance of an express app.
const app = express();
const fs = require('fs');
const _ = require('lodash');
const engines = require('consolidate')

const users = [];

fs.readFile('users.json', { encoding: 'utf8' }, (err, data) => {
  if (err) throw err;

  JSON.parse(data).forEach(user => {
    user.name.full = _.startCase(`${user.name.first} ${user.name.last}`);
    users.push(user)
  })
})

//  whenever express is asked to render anything with an hbs extension, use engines.handlebars
app.engine('hbs', engines.handlebars)

// adds support for template engines
//  when rendering a view look in the view directory
app.set('views', './views')
//  use the jade view engine
// app.set('view engine', 'jade')
// use handlebars view engine
app.set('view engine', 'hbs')

// app.use(express.static('images'))
app.use('/profilepics', express.static('images'))

// when express gets an http 'GET' request to the root path, call this function
app.get('/', (req, res) => {
  // render the index view file
  // we can pass it an object, which is accessible within the view
  // by default 'index' is whatever the engine is which we have chosen, however we could explicitly add the extension
  // which would override this - res.render('index.jade', { users: users })
  res.render('index', { users: users })
})



app.get('/:username', (req, res) => {
  const username = req.params.username;
  res.render('user', { username })
})



// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
