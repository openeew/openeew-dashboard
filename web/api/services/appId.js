const fetch = require('node-fetch');
const generator = require('generate-password');
const qs = require('qs');

let TENET_ID;
let services = null;

if (process.env.VCAP_APPLICATION) {
  services = JSON.parse(process.env.VCAP_SERVICES);
  TENET_ID = services.AppID[0].credentials.tenantId;
} else {
  TENET_ID = require('../vcap-local.json').services.AppID.credentials.tenantId;
}

/**
 * Authenticates requests to AuthID management API
 */
class AppIdManagement {
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
      console.error(await response.json());
      throw new Error('api_auth_fail');
    }

    const json = await response.json();

    this.accessToken = json.access_token;
    this.tokenExpires = json.expiration;
  }

  get iamAuth() {
    return (async () => {
      if (!this.accessToken) {
        await this.callAccessAPI();
      }

      // If token has expired...
      if (
        Math.floor(new Date().getTime() / 1000) >
        new Date(this.tokenExpires).getTime()
      ) {
        await this.callAccessAPI();
      }

      return { token: this.accessToken, expires: this.tokenExpires };
    })();
  }

  async getUserById(id) {
    const iam = await this.iamAuth;

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/Users/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();

      if (error.status === '404') {
        throw new Error('user_not_found');
      }

      throw new Error('get_userById_fail');
    }

    const json = await response.json();

    return json;
  }

  async changeUserPassword(id, newPassword, changedIpAddress) {
    const iam = await this.iamAuth;

    const data = JSON.stringify({
      uuid: id,
      newPassword,
      changedIpAddress,
    });

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/change_password`,
      {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          Accept: 'application/json',
          // eslint-disable-next-line quote-props
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.json());

      throw new Error('change_pw_fail');
    }

    const json = await response.json();

    return json;
  }

  async updateUser(id, updatedUser) {
    const iam = await this.iamAuth;

    const data = JSON.stringify(updatedUser);

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/Users/${id}`,
      {
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          Accept: 'application/json',
          // eslint-disable-next-line quote-props
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.json());

      throw new Error('updated_user_fail');
    }

    const json = await response.json();

    return json;
  }

  async verifyUserByEmail(email) {
    const iam = await this.iamAuth;

    const formattedEmail = email.replace('@', '%40');

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/Users?query=${formattedEmail}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.json());
      throw new Error('verify_email_fail');
    }

    const json = await response.json();

    return json;
  }

  async createUser(email) {
    const iam = await this.iamAuth;

    const data = JSON.stringify({
      active: false,
      emails: [
        {
          value: email,
          primary: true,
        },
      ],
      userName: email,
      password: generator.generate({
        length: 16,
        numbers: false,
      }),
    });

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/sign_up`,
      {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          Accept: 'application/json',
          // eslint-disable-next-line quote-props
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.json());
      throw new Error('create_user_fail');
    }

    const json = await response.json();

    return json;
  }

  async removeUser(id) {
    const iam = await this.iamAuth;

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/remove/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${iam.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.json());
      throw new Error('remove_user_fail');
    }

    return response.ok;
  }
}

const _AppIdManagement = new AppIdManagement();

module.exports = _AppIdManagement;
