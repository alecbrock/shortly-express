const parseCookies = (req, res, next) => {
  var ip = req.headers['x-forwarded-for'];

  if (req.headers.hasOwnProperty('cookie')) {
    var cookies = req.headers.cookie.split(';');

    for (var cookie of cookies) {
      var currentCookie = cookie.split('=');
      req.cookies[currentCookie[0].trim()] = currentCookie[1];
    }
  } else {

  }
  next();
};

module.exports = parseCookies;