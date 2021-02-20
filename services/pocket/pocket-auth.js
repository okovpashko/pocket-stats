const got = require('got');

const POCKET_API_ROOT = 'https://getpocket.com/v3';
const POCKET_WEB_ROOT = 'https://getpocket.com';

class PocketAuth {
  constructor({ consumerKey, redirectUrl } = {}) {
    this.consumerKey = consumerKey;
    this.redirectUri = redirectUrl;
  }

  async getRequestToken() {
    const response = await got.post(`${POCKET_API_ROOT}/oauth/request`, {
      json: {
        consumer_key: this.consumerKey,
        redirect_uri: this.redirectUri,
        state: 'mystate',
      },
      responseType: 'json',
      headers: {
        Accept: '*/*',
        'X-Accept': 'application/json',
      },
    });

    return response.body.code;
  }

  async getAuthInitialOptions() {
    const requestToken = await this.getRequestToken();

    const redirectUrl = new URL('/auth/authorize', POCKET_WEB_ROOT);

    redirectUrl.searchParams.append('request_token', requestToken);
    redirectUrl.searchParams.append('redirect_uri', this.redirectUri);

    return {
      authUrl: redirectUrl.toString(),
      requestToken,
    };
  }

  async getAccessToken(authorizationCode) {
    const response = await got.post(`${POCKET_API_ROOT}/oauth/authorize`, {
      json: {
        consumer_key: this.consumerKey,
        code: authorizationCode,
      },
      responseType: 'json',
      headers: {
        Accept: '*/*',
        'X-Accept': 'application/json',
      },
    });

    return response.body.access_token;
  }
}

module.exports = PocketAuth;
