const express = require('express');
const PocketArticles = require('../services/pocket/pocket-articles');
const router = express.Router();

const redirectUnauthenticated = require('../middleware/redirect-unauthenticated');

const { POCKET_CONSUMER_KEY } = process.env;

/* GET home page. */
router.get('/', redirectUnauthenticated, async function (req, res, next) {
  const { pocketAccessToken } = req.cookies; // TODO: use constant with the cookie name

  const articlesApi = new PocketArticles({
    consumerKey: POCKET_CONSUMER_KEY,
    accessToken: pocketAccessToken,
  });

  let unreadArticles;

  try {
    unreadArticles = await articlesApi.getUnread();
  } catch (error) {
    next(error);
  }

  res.render('index', { title: 'Pocket stats', articles: Object.values(unreadArticles) });
});

module.exports = router;
