const express = require('express');
const PocketArticles = require('../services/pocket/pocket-articles');
const router = express.Router();

const {APP_URL, POCKET_CONSUMER_KEY} = process.env;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const {pocketAccessToken} = req.cookies; // TODO: use constant with the cookie name

  const articlesApi = new PocketArticles({
    consumerKey: POCKET_CONSUMER_KEY,
    accessToken: pocketAccessToken,
  });

  const articles = Object.values(await articlesApi.getUnread());

  res.render('index', { title: 'Pocket stats', articles });
});

module.exports = router;
