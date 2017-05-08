const express = require('express');
// creates a new instance of an express app.
const app = express();
const fs = require('fs');
const startCase = require('lodash/startCase')
const engines = require('consolidate')
const path = require('path');
const bodyParser = require('body-parser');
const users = [];

const getUserFilePath = username => {
  const filePath = path.join(__dirname, 'users', username);
  return `${filePath}.json`;
}

const getUser = username => {
  const user = JSON.parse(fs.readFileSync(getUserFilePath(username), { encoding: 'utf8' }));
  const { first, last } = user.name;
  user.name.full = startCase(`${first} ${last}`)
  Object.keys(user.location).forEach(key => {
    user.location[key] = startCase(user.location[key])
  })
  return user;
}

const saveUser = (username, data) => {
  const filePath = getUserFilePath(username);
  // deletes the file
  fs.unlinkSync(filePath)
  // writes the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' })
}

fs.readFile('users.json', { encoding: 'utf8' }, (err, data) => {
  if (err) throw err;

  JSON.parse(data).forEach(user => {
    user.name.full = startCase(`${user.name.first} ${user.name.last}`);
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

app.use(bodyParser.urlencoded({ extended: true }))

// when express gets an http 'GET' request to the root path, call this function
app.get('/', (req, res) => {
  // render the index view file
  // we can pass it an object, which is accessible within the view
  // by default 'index' is whatever the engine is which we have chosen, however we could explicitly add the extension
  // which would override this - res.render('index.jade', { users: users })
  res.render('index', { users: users })
})



app.get('/:username', (req, res) => {
  const user = getUser(req.params.username);
  res.render('user', { user, address: user.location })
})

app.put('/:username', (req, res) => {
  const username = req.params.username
  const user = getUser(username)
  console.log(req.body);
  user.location = req.body;
  saveUser(username, user)
  res.end()
})



// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
