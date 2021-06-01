# OpenEEW Dashboard

The OpenEEW Dashboard is a web application currently being developed by the OpenEEW community for the purpose of managing network sensors and viewing sensor data.

Currently, the project consists of:

- A React application built with [IBM's Carbon Design System](https://www.carbondesignsystem.com)
- An API that handles requests from the React dashboard and other OpenEEW applications
- Grafana dashboards that provide sensor visualizations, used in lieu of the web application until this project is further along in development [(see more)](https://github.com/openeew/openeew-dashboard/tree/master/grafana)

## For developers: Setup a development environment

Creating a development environment involves cloning this repository and setting up several API keys, secrets and other environment variables for both the React application and API.

**1. Create a vcap-local.json file from the template provided to store API credentials**

Make a copy of the `vcap-local.template.json` file located in the `web/api` directory and rename it `vcap-local.json` (this file is ignored by Git) using this command:

```bash
# from the root directory
cp ./web/api/vcap-local.template.json ./web/api/vcap-local.json
```

**2. Add IBM Cloud service credentials and required environment variables to `vcap-local.json`**

This step will require a [IBM Cloud account](https://www.ibm.com/cloud).

**AppID**

1. Provision an AppID instance in IBM Cloud
   https://cloud.ibm.com/catalog/services/app-id
2. Add at least one user to Cloud Directory to authenticate in development. From the AppID instance, go to Cloud Directory -> Users -> Create User
3. Create AppID service credentials: In the newly created AppID instance, go to Service Credentials -> New credential. Set the role to `Writer`.
4. Expand the created credentials and fill in the required properties in your `vcap-local.json` file located in `web/api` under `AppID` and `credentials`. You can leave the `scopes` field as an empty array.
5. Copy the `apiKey` from your service credentials and add it to `vcap-local.json` in the `api_key` field under `ibm_cloud`

**Other required environment variables**

Also add the following environment variables to your `vcap-local.json` file:

1. `session_secret`
   For development, this can be any random string of characters

2. `openeew_api_key`
   For development, this can be any random string of characters. This is used to send authenticated requests to the API

3. `jwt_secret` For development, this can be any random string of characters

All of these should be changed and kept secret in production.

**3. Add a Mapbox access token to the React client**

If you don't already have a [Mapbox](https://mapbox.com) account, create one, and then navigate to your account's [access token page](https://account.mapbox.com/access-tokens/) to view your tokens. You can use the Default public token or create a new one.

After you have copied your token, create a file called **.env.local** in
the **web/client** directory.

In **.env.local** add the following, replacing your_token with your Mapbox access token. Save -- the application should include the key as an environment variable.

```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_token
```

**3. Install dependencies for both the mock API and application**

```bash
# setup scripts are located in /web
cd web

# this might take a few minutes
npm run setup
```

**4. Start the mock API and application concurrently**

```bash
# From the /web directory
npm start
```

**5. Start developing!**

The application should be running on http://localhost:3000.

The mock API should be running on http://localhost:4000

## Screenshot

![dashboard-events.png](/images/dashboard-events.png)

## Docker

Install [Docker](https://www.docker.com/get-started) and build your own image.

```shell-script
cd web
docker build --tag openeew/dashboard:dev .
```

Then run a development container:

```shell-script
docker run \
  --interactive \
  --detach \
  --publish 3000:3000 \
  --name openeew-dashboard-dev \
  openeew/dashboard:dev
```

## Design & Development

It is planned to expand this application so that in future, it will allow for the following:

- User authentication through IBM Cloud App ID
- Ability to connect to your sensor device, or the global OpenEEW network of devices
- Ability to configure your device (sample rate, device ID) and also query statistics (connectivity, signal quality)
- Ability to see historic data from your device and run simulations with detection system
- Ability to visualize sensor accelerations for each axis
- Ability to see sensor(s) on map

For every new addition to this application, there is a process in which prototypes and designs are discussed and approved by the OpenEEW community and Technical Steering Committee before development starts. To join the conversation, and to begin contributing to this project, please join [our slack channel](https://openeew.slack.com) and review the **Contributing and Developer Information** section below.

You can view the [current prototype here](https://ibm.invisionapp.com/share/3FO0NR58WK6#/screens/319792717_EW_Login-_ID_Empty).

## Contributors

<a href="https://github.com/openeew/openeew-dashboard/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=openeew/openeew-dashboard" />
</a>

---

Enjoy! Give us [feedback](https://github.com/openeew/openeew-dashboard/issues) if you have suggestions on how to improve this information.

## Contributing and Developer Information

The community welcomes your involvement and contributions to this project. Please read the OpenEEW [contributing](https://github.com/openeew/openeew/blob/master/CONTRIBUTING.md) document for details on our code of conduct, and the process for submitting pull requests to the community.

## License

This information is licensed under the Apache Software License, Version 2. Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](http://www.apache.org/licenses/LICENSE-2.0.txt).
