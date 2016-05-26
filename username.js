const express = require('express');
const helpers = require('./helpers');
const fs = require('fs');
//  create our own instance of a Router
const router = express.Router({
  mergeParams: true
})

router.all('/', (req, res, next) => {
  console.log(req.method, 'for', req.params.username);
  next();
})

router.get('/', helpers.verifyUser, (req, res) => {
  const username = req.params.username;
  const user = helpers.getUser(username);
  // The file user.hbs
  // Properties we want to be availble to the view
  res.render('user', {
    user: user,
    address: user.location
  });
});

// makes it easier to define subpaths as shown here
router.get('/edit', (req, res) => {
  res.send(`You wanna edit ${req.params.username} ??`)
})

router.put('/', (req, res) => {
  const username = req.params.username;
  const user = helpers.getUser(username);
  // data object which is passed back from the form
  user.location = req.body;

  helpers.saveUser(username, user);
  // end the request
  res.end();
});

router.delete('/', (req, res) => {
  const fp = helpers.getUserFilePath(req.params.username);
  // deletes file
  fs.unlinkSync(fp);
  // send a 200 status back to the client
  res.sendStatus(200);
});

module.exports = router;

// app.route('/:username')
// .all((req, res, next) => {
//   console.log(req.method, 'for', req.params.username);
//   next();
// })
// .get(helpers.verifyUser, (req, res) => {
//   const username = req.params.username;
//   const user = helpers.getUser(username);
//   // The file user.hbs
//   // Properties we want to be availble to the view
//   res.render('user', {
//     user: user,
//     address: user.location
//   })
// })
// .put((req, res) => {
//   const username = req.params.username;
//   const user = helpers.getUser(username);
//   // data object which is passed back from the form
//   user.location = req.body;
//
//   helpers.saveUser(username, user);
//   // end the request
//   res.end();
// })
// .delete((req, res) => {
//   const fp = helpers.getUserFilePath(req.params.username);
//   // deletes file
//   fs.unlinkSync(fp);
//   // send a 200 status back to the client
//   res.sendStatus(200);
// })
