const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// returns the .json file filepath for a specified user, based on their username
function getUserFilePath(username) {
  return path.join(__dirname, 'users', username) + '.json';
}

function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), { encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);

  _.keys(user.location).forEach(function(key) {
    user.location[key] = _.startCase(user.location[key]);
  });

  return user;
}

function saveUser(username, data) {
  const fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), { encoding: 'utf8'});
}

function verifyUser(request, response, next) {
  const filepath = getUserFilePath(request.params.username);
  // check if the file exists at filepath exists
  fs.exists(filepath, function(yes) {
    // returns boolean
    if(yes) {
      // if true go to next
      // next is the next function, in this case is the anonymous function after verifyUser is called
      next()
    } else {
      // redirect to our error route
      response.redirect('/error/' + request.params.username);
    }
  })
}

exports.getUserFilePath = getUserFilePath;
exports.getUser = getUser;
exports.saveUser = saveUser;
exports.verifyUser = verifyUser;
