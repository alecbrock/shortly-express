const parseCookies = (req, res, next) => {

  if (req.headers.hasOwnProperty('cookie')) {
    var cookies = req.headers.cookie.split(';');

    for (var cookie of cookies) {
      var currentCookie = cookie.split('=');
      req.cookies[currentCookie[0].trim()] = currentCookie[1];
    }
  }
  next();
};

module.exports = parseCookies;