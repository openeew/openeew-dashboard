const fetch = require('node-fetch');
const qs = require('qs');

/**
 * Authenticates requests to AuthID management API
 */
class _IBMCloudIAM {
  constructor() {
    this.apiKey = null;
    this.accessToken = null;
    this.tokenExpires = null;

    // Use env var if in IBM Cloud env
    if (process.env.VCAP_APPLICATION) {
      this.apiKey = process.env.IAM_API_KEY;
    } else {
      // Otherwise, use vcap-local
      this.apiKey = require('../vcap-local.json').ibm_cloud.api_key;
    }
  }

  async callAccessAPI() {
    const data = qs.stringify({
      apikey: this.apiKey,
      // eslint-disable-next-line camelcase
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    });

    const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // eslint-disable-next-line quote-props
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(response);
      throw new Error('api_auth_fail');
    }

    const json = await response.json();

    this.accessToken = json.access_token;
    this.tokenExpires = json.expiration;
  }

  async getAccessToken() {
    if (!this.accessToken) {
      await this.callAccessAPI();
    }

    if (
      Math.floor(new Date().getTime() / 1000) >
      new Date(this.tokenExpires).getTime()
    ) {
      await this.callAccessAPI();
    }

    return this.accessToken;
  }
}

const IBMCloudIAM = new _IBMCloudIAM();

module.exports = IBMCloudIAM;
