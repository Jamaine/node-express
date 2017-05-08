const express = require('express');
// creates a new instance of an express app.
const app = express();
const fs = require('fs');
const startCase = require('lodash/startCase')
const engines = require('consolidate')
const path = require('path');
const bodyParser = require('body-parser');

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
  const users = [];
  // read the users directory
  fs.readdir('users', (err, files) => {
    // files is an array of the files in the directory
    files.forEach((file) => {
      // read each file
      fs.readFile(path.join(__dirname, 'users', file), 'utf8', (err, data) => {
        const user = JSON.parse(data)
        const { first, last } = user.name
        user.name.full = startCase(`${first} ${last}`)
        users.push(user)
        if (users.length === files.length) {
          res.render('index', { users })
        }
      })
    })
  })
})

app.get('/favicon.ico', (req, res) => {
  res.send(204)
})


app.get('/:username', (req, res) => {
  console.log(req.params);
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

app.delete('/:username', (req, res) => {
  const fp = getUserFilePath(req.params.username);
  // delete file
  fs.unlinkSync(fp);
  // sends a 200 status to let the client know the request completed successfully
  res.sendStatus(200);
})



// starts application
// app.listen(7100)

const server = app.listen(7100, () => {
  // gives some feedback when server has started up
  console.log(`Server running at http://localhost:${server.address().port}`);
})
