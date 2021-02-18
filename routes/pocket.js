const express = require('express');
const format = require('date-fns/format');

const PocketAuth = require('../services/pocket/pocket-auth');
const PocketArticles = require('../services/pocket/pocket-articles');

const REQUEST_TOKEN_COOKIE = 'requestToken';
const ACCESS_TOKEN_COOKIE = 'pocketAccessToken';

const {APP_URL, POCKET_CONSUMER_KEY} = process.env;

function createPocketRouter() {
  const router = express.Router();

  const pocketAuth = new PocketAuth({
    consumerKey: POCKET_CONSUMER_KEY,
    redirectUrl: `${APP_URL}/pocket/auth/callback`
  });

  router.get('/auth/callback', async function(req, res, next) {
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
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      .clearCookie(REQUEST_TOKEN_COOKIE, {httpOnly: true})
      .send('Success!');
  });

  router.get('/auth', async function(req, res, next) {
    let authInitialOptions;

    try {
      authInitialOptions = await pocketAuth.getAuthInitialOptions();
    } catch (error) {
      return next(error);
    }

    const {authUrl, requestToken} = authInitialOptions;

    res.cookie(REQUEST_TOKEN_COOKIE, requestToken, {httpOnly: true, maxAge: 5 * 60 * 1000})
      .redirect(authUrl);
  });

  router.get('/stats', async function(req, res, next) {
    const {pocketAccessToken} = req.cookies; // TODO: use constant with the cookie name

    const articlesApi = new PocketArticles({
      consumerKey: POCKET_CONSUMER_KEY,
      accessToken: pocketAccessToken,
    });

    const articles = await articlesApi.getUnread();

    const byMonth = new Map();

    Object.values(articles).forEach(article => {
      const dateAdded = new Date(article.time_added * 1000);
      const monthAddedFormatted = format(dateAdded, 'yyyy-MM');

      if (byMonth.has(monthAddedFormatted)) {
        byMonth.get(monthAddedFormatted).add(article);
      } else {
        const articlesSet = new Set([article]);
        byMonth.set(monthAddedFormatted, articlesSet);
      }
    });

    const countByMonth = [];

    for(let [month, articles] of byMonth.entries()) {
      countByMonth.push({month, count: articles.size});
    }

    countByMonth.sort((first, second ) => first.month > second.month ? 1 : -1);

    res.json(countByMonth);
  });

  return router;
}

module.exports = createPocketRouter;

