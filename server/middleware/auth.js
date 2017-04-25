const models = require('../models');
const Promise = require('bluebird');

  // check if session exists
    // if session exists, check for user-agent match
      // if no use ragent match, delete session
    // If session not exists, see below

module.exports.createSession = (req, res, next) => {
  models.Sessions.create(req, res)
    .then(result => {
      return models.Sessions.get({ id: result.insertId });
    })
    .then(session => {
      //res.cookie['shortlyid'] = session.hash;
      req.session = {};
      req.session['hash'] = session.hash;
      res.cookies = {};
      res.cookies['shortlyid'] = { value: session.hash };
      if (session.user_id === null) {
        throw 'Unknown user session';
      } else {
        models.Users.get({ id: session.user_id });
      }
    })
    .then(user => {
      req.sessions['username'] = user.username;
      req.sessions['user_id'] = user.id;
      next();
    })
    .catch(err => {
      console.log('** Create Session CATCH ** ', err);
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

