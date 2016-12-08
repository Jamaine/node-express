const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const engines = require('consolidate');
const path = require('path');

const app = express();

const albums = [];

fs.readFile('albums.json', (error, data) => {
  if (error) {
    return console.error(error)
  }
  JSON.parse(data).forEach(album => {
    albums.push(album)
  });
});

app.engine('hbs', engines.handlebars);
app.set('view engine', 'hbs');
app.set('views', './views');
// app.use(express.static('images'))
app.use('/albumpics', express.static('images'))

app.get('/', (request, response) => {
  response.render('index', { albums: albums });
})

function getAlbumFilePath(albums) {
  return path.join(__dirname, 'albums', albums) + '.json';
}

function verifyUser(request, response, next) {
  const albumId = request.params.albumId
  const albumPath = getAlbumFilePath(albumId);
  fs.exists(albumPath, (yes) => {
    if (yes) {
      next();
    } else {
      response.redirect(`/error/${albumId}`);
    }
  });
}

const getUser = (albumId) => {
  return JSON.parse(fs.readFileSync(getAlbumFilePath(albumId), { encoding: 'utf-8' }));
}


app.get('/albums/:albumId', verifyUser, (request, response) => {
  const albumId = request.params.albumId;
  const album = getUser(albumId);
  response.render('albums', { album: album });
});

app.get('/error/:albumId', (request, response) => {
  response.send(`there is no ${request.params.albumId}`);
});

const server = app.listen(3310, () => {
  console.log(`listening on port` , server.address().port);
});
