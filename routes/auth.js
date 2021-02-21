const express = require('express');

const PocketAuth = require('../services/pocket/pocket-auth');

const REQUEST_TOKEN_COOKIE = 'requestToken';
const ACCESS_TOKEN_COOKIE = 'pocketAccessToken';

const { APP_URL, POCKET_CONSUMER_KEY, NODE_ENV } = process.env;
const isProductionMode = NODE_ENV === 'production';

function createAuthRouter() {
  const router = express.Router();

  const pocketAuth = new PocketAuth({
    consumerKey: POCKET_CONSUMER_KEY,
    redirectUrl: `${APP_URL}/auth/callback`,
  });

  router.get('/callback', async function (req, res, next) {
    const requestToken = req.cookies[REQUEST_TOKEN_COOKIE];

    if (!requestToken) {
      return next(new Error('Request token is missed or expired. Try to authenticate again.'));
    }

    let accessToken;

    try {
      accessToken = await pocketAuth.getAccessToken(requestToken);
    } catch (error) {
      return next(error);
    }

    return res
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProductionMode,
      })
      .clearCookie(REQUEST_TOKEN_COOKIE, { httpOnly: true, secure: isProductionMode })
      .redirect('/');
  });

  router.get('/init', async function (req, res, next) {
    let authInitialOptions;

    try {
      authInitialOptions = await pocketAuth.getAuthInitialOptions();
    } catch (error) {
      return next(error);
    }

    const { authUrl, requestToken } = authInitialOptions;

    res
      .cookie(REQUEST_TOKEN_COOKIE, requestToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: isProductionMode,
      })
      .redirect(authUrl);
  });

  router.get('/', function (req, res) {
    return res.render('login', { loginUrl: '/auth/init' });
  });

  return router;
}

module.exports = createAuthRouter;
