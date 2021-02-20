module.exports =  function redirectUnauthenticated(req, res, next) {
  // TODO: constant for the token name
  const {pocketAccessToken} = req.cookies;

  if (!pocketAccessToken) {
    return res.redirect('/pocket/auth');
  }

  next();
}
