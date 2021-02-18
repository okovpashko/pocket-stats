const got = require('got');

const POCKET_API_ROOT = 'https://getpocket.com/v3';

class PocketArticles {
  constructor({accessToken, consumerKey} = {}) {
    this.accessToken = accessToken;
    this.consumerKey = consumerKey;
  }

  async getUnread() {
    const response = await got.post(`${POCKET_API_ROOT}/get`, {
      json: {
        consumer_key: this.consumerKey,
        access_token: this.accessToken,
        // since: since.valueOf() / 1000,
        sort: 'newest',
        // count: 50,
        // detailType: 'complete',
      },
      responseType: 'json',
      headers: {
        'Accept': '*/*',
        'X-Accept': 'application/json',
      }
    });

    return response.body.list;
  }
}

module.exports = PocketArticles;
