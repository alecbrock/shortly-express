const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const cookieParser = require('./middleware/cookieParser');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from ../public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use(cookieParser);

// app.use(Auth.createSession);

app.get('/', Auth.createSession,
(req, res) => {
  res.render('index');
});

app.get('/login',
(req, res) => {
  res.render('login');
});

app.get('/create', 
(req, res) => {
  res.render('index');
});

app.get('/links', 
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', 
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

app.post('/signup', 
(req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  
  //var user = new users.User();

  return models.Users.get({ username: username })
    .then(foundUser => {
      if (foundUser) {
        throw 'Found: Redirect to /login';
      } else {
        return models.Users.create(username, password);
      }
    })
    .then((results) => {
      throw results;
    })
    .error(error => {
      return res.status(500).send(error);
    })
    .catch(err => {
      if (err === 'Found: Redirect to /login') {
        res.redirect('/login');      
      } else {
        res.redirect('/');
      }
      res.end();      
    });
});

app.post('/login', Auth.createSession,
(req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  console.log('*** req', Object.keys(req));  
  console.log('*** req.headers', Object.keys(req.headers));
  console.log('*** req.session', req.session);

  return models.Users.get({ username: username })
    .then(foundUser => {
      if (foundUser) {
        if (models.Users.checkPassword(password, foundUser.password, foundUser.salt)) {
          throw 'login success';
        }
      } else {
        throw 'Go to login';
      }
    })
    .then((results) => {
      throw results;
    })
    .error(error => {
      return res.status(500).send(error);
    })
    .catch(err => {
      if (err === 'login success') {
        res.redirect('/');      
      } else {
        res.redirect('/login');
      }
      res.end();      
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/



/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
