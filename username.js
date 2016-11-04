const express = require('express');
const helpers = require('./helpers');
const fs = require('fs');

const User = require('./db').User

//  create our own instance of a Router
const router = express.Router({
  mergeParams: true
})
// .use without mount path fires for every request the router handles
router.use((req, res, next) => {
  console.log(req.method, 'for', req.params.username, `at ${req.path}`);
  next();
})

router.get('/', (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username}, (err, user) => {
    // The file user.hbs
    // Properties we want to be availble to the view
    res.render('user', {
      user: user,
      address: user.location
    });
  });
});

// if the callback has 4 arguments, the first is error
// type an incorrect username to test - http://localhost:7200/bigkoala328r
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('something broke')
})

// makes it easier to define subpaths as shown here
router.get('/edit', (req, res) => {
  res.send(`You wanna edit ${req.params.username} ??`)
})

router.put('/', (req, res) => {
  const username = req.params.username;
  User.findOneAndUpdate({ username: username }, { location: req.body }, (err, user) => {
    res.end();
  });
});

router.delete('/', (req, res) => {
  const fp = helpers.getUserFilePath(req.params.username);
  // deletes file
  fs.unlinkSync(fp);
  // send a 200 status back to the client
  res.sendStatus(200);
});

module.exports = router;
