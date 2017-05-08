
`app.listen()`
Starts application

`app.get(path, (request, result, next))`
* `next` this route handler is done, move onto the next route handler

`app.get('/:pathname')`
* `:` indicates the following text is a path variable, whatever the pathname is from request.params.username in this case
* `/:username` adds username to req.params object, with a property of the variable pathname
* /:username /skinout = `req.params = { username: 'skinout' }`

`app.set('view engine', 'hbs')`
* use handlebars view engine


`app.use(path, callback)`
* https://expressjs.com/en/api.html#app.use
* Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
* takes an optional path, as a string, regex, or array of either

`app.use(path, express.static('images'))`
* serves static files from the directory `images`
  * `<img src="{{user.username}}_sm.jpg" alt="">` will look in the images folder for the images
* If a path is defined, you can prefix your paths
  * `<img src="{{/profilepics/user.username}}_sm.jpg" alt="">` will still look in the images folder for the images

`res.send()`
* sends the result to the browser
* request is over and nothing else will run

`res.render()`
* https://expressjs.com/en/api.html#res.render
* Renders a view and send the resulting html string to the client
* we can pass it an object, which is accessible within the view
* by default 'index' is whatever the engine is which we have chosen, however we could explicitly add the extension
* which would override this - `res.render('index.jade', { users: users })`


`app.engine(ext, callback)`
* https://expressjs.com/en/api.html#app.engine
* use this for engines which do not support express out of the box
* for templates which are compatible with the `consolidate` library, you can use the below, where `engines` = `consolidate`
  * `app.engine('hbs', engines.handlebars)`


### [fs.readdir()](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback)
* reads the contents of a directory

### Devtools
* nodemon
 - Watches for changes to files in our project and restarts the server

 * consolidate
 - Provides support for template libraries which don't support express out of the box
