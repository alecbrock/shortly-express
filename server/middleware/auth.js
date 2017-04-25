const models = require('../models');
const Promise = require('bluebird');

  // check if session exists
    // if session exists, check for user-agent match
      // if no use ragent match, delete session
    // If session not exists, see below

module.exports.createSession = (req, res, next) => {

  // If it has a cookie, check if has a valid session
  if (req.cookies && req.cookies.hasOwnProperty('shortlyid')) {

    models.Sessions.get({ hash: req.cookies['shortlyid'] })
      .then((session) => {
        if (session) {
          if (req.headers['user-agent'] !== session.user_agent) {
            models.Sessions.delete({ hash: session.hash });
            // create session or redir login?
          } else if (session.user_id === null) {
            throw 'Redirect to login';
          } else {  // user is authorized
            throw 'Go to next';
          }
        }
      })
      .then(() => {
        return models.Sessions.create(req, res);
      })
      .then(result => {
        return models.Sessions.get({ id: result.insertId });        
      })
      .then((session) => {
        req.session = {};
        req.session['hash'] = session.hash;
        res.cookies = {};
        res.cookies['shortlyid'] = { value: session.hash };
        res.setHeader('Set-Cookie', ['shortlyid=' + session.hash]);
        throw 'Redirect to login';
      }) // then after deleting
      .catch(err => {
        if (err === 'Redirect to login') {
          res.redirect('/login');
          next();
        } else if (err === 'Go to next') {
          next();
        } else {
          next();
        }
      });
  } else {
    // if it doesn't have a cookie, create a session

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
        res.setHeader('Set-Cookie', ['shortlyid=' + session.hash]);
        // if (session.user_id === null) {
        //   throw 'Unknown user session';
        // } else {
        //   models.Users.get({ id: session.user_id });
        // }
        next();

      })
      // .then(user => {
      //   req.sessions['username'] = user.username;
      //   req.sessions['user_id'] = user.id;
      //   next();
      // })
      .catch(err => {
        console.log('** Create Session CATCH ** ', err);
        next();
      });

  }
    
};

module.exports.isLoggedIn = (req, res, next) => {

  console.log('** isLoggedIn **');

  if (req.cookies.hasOwnProperty('shortlyid')) {
    models.Sessions.get({ hash: req.cookies['shortlyid'] })
      .then((session) => {
        if (req.headers['user-agent'] !== session.user_agent) {
          model.Sessions.delete({ hash: session.hash });
          // create session or redir login?
        } else if (session.user_id === null) {
          throw 'Redirect to login';
        } else {  // user is authorized
          throw 'Go to next';
        }
      })
      .then(() => {
        throw 'Redirect to login';
      }) // then after deleting
      .catch(err => {
        if (err === 'Redirect to login') {
          res.redirect('/login');
        } else if (err === 'Go to next') {
          next();
        }
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

