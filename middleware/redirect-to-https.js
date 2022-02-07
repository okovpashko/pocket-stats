const HttpStatus = require('http-status-codes');

module.exports = function redirectToHttps(req, res, next) {
  if (req.protocol === 'http' && process.env.NODE_ENV === 'production') {
    const redirectUrl = new URL(req.originalUrl, `https://${req.get('host')}`);
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, redirectUrl.toString());
  }

  next();
};
