const express = require('express');
const app = express();
const engines = require('consolidate');
const path = require('path');
const fs = require('fs');

const getAlbumPath = albumName => {
  fp = path.join(__dirname, 'albums', albumName);
  return `${fp}.json`;
}

const getAlbumData = albumName => {
  const album = JSON.parse(fs.readFileSync(getAlbumPath(albumName), 'utf8'));
  album.simpleArtists = album.artists.reduce((artists, { name }) => (
      artists += !artists.length ?
      `${name}` :
      `/ ${name}`
  ), '')
  album.simpleTracks = album.tracks.items.map(track => (
    track = { track_name: track.name, track_number: track.track_number}
  ))
  return album
}


const saveAlbum = (albumName, data) => {
  const path = getAlbumPath(albumName)
  fs.unlinkSync(path)
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
}

app.engine('hbs', engines.handlebars)
app.set('view engine', 'hbs');
app.use('/albumpics', express.static('images'))





app.get('/', (req, res) => {
  fs.readdir(path.join(__dirname, 'albums'), (err, files) => {
    const albums = files.map(file => (
      JSON.parse(fs.readFileSync(path.join(__dirname, 'albums', file)), 'utf8')
    ))
    res.render('index', { albums })
  })
})

app.get('/albums/:album', (req, res) => {
  const album = getAlbumData(req.params.album)
  res.render('albums', { album })
})

app.put('/albums/:album', (req, res) => {
  const albumName = req.params.album
  const albumData = getAlbumData(albumName)
  albumData.simpleTracks = req.body
  saveAlbum(albumName, albumData)

})

const server = app.listen('7100', () => {
  console.log(`listening on localhost:${server.address().port}`)
})
