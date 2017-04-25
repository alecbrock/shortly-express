const parseCookies = (req, res, next) => {
  console.log('req.headers: ', req.headers, '** req.session: **', Object.keys(req.headers), '| req.cookies: ', req.cookies);

  console.log('=> req.headers: ', req.headers);
  if (req.headers.hasOwnProperty('cookie')) {
    var cookies = req.headers.cookie.split(';');

    for (var cookie of cookies) {
      var currentCookie = cookie.split('=');
      console.log('** cookie: **', cookie, currentCookie);

      req.cookies[currentCookie[0].trim()] = currentCookie[1];

      // if (currentCookie[0] === 'shortlyid') {
      //   req.cookies['shortlyid'] = currentCookie[1];
      //   // return;
      // }
    }
  }
  next();
};

module.exports = parseCookies;