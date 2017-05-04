const express = require('express');
const app = express()
const engines = require('consolidate')
const fs = require('fs')

let albums = [];

app.set('views', './views');
app.set('view engine', 'hbs')
app.engine('hbs', engines.handlebars)

fs.readFile('./albums.json', 'utf8', (err, data) => {
  albums = JSON.parse(data)
})

app.get('/', (req, res) => {
  res.render('index', { albums })
})

app.get('/:name', (req, res) => {
  res.send(req.params.name)
})


const server = app.listen(7100, () => {
  console.log(`listening on localhost:${server.address().port}`);
})
