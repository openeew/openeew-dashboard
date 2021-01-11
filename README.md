# OpenEEW Dashboard

The OpenEEW Dashboard is a web application currently being developed by the OpenEEW community for the purpose of managing network sensors and viewing sensor data.

Currently, the project consists of:

- A React application that displays a dashboard built with [IBM's Carbon Design System](https://www.carbondesignsystem.com)
- A simple GraphQL server that mocks the delivery of sample acceleration data
- Grafana dashboards that provide sensor visualizations, used in lieu of the web application until this project is further along in development [(see more)](https://github.com/openeew/openeew-dashboard/tree/master/grafana)

## Quick start for Developers

**1. Install dependencies for both the mock API and application**

```bash
# setup scripts are located in /web
cd web

# this might take a few minutes
npm run setup
```

**2. Add a Mapbox access token for local development**

If you don't already have a [Mapbox](https://mapbox.com) account, create one, and then naviagte to your account's [access token page](https://account.mapbox.com/access-tokens/) to view your tokens. You can use the Default public token or create a new one.

After you have copied your token, create a file called **.env.local** in
the **web/client** directory.

In **.env.local** add the following, replacing your_token with your Mapbox access token. Save -- the application should include the key as an environment variable.

```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_token
```

**3. Start the mock API and application concurrently**

```bash
# From the /web directory
npm start
```

**4. Start developing!**

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
  --publish 4000:4000 \
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

For every new addition to this application, there is a process in which prototypes and designs are discussed and approved by the OpenEEW community and Technical Steering Committee before development starts. To join the conversation, and to begin contributing to this project, please join [our slack channel](https://openeew.com/) and review the **Contributing and Developer Information** section below.

You can view the [current prototype here](https://ibm.invisionapp.com/share/3FO0NR58WK6#/screens/319792717_EW_Login-_ID_Empty).

## Initial Authors

- [Grillo](https://grillo.io)
- [Ryan Kelley](https://github.com/rdkelley)

---

Enjoy! Give us [feedback](https://github.com/openeew/openeew-dashboard/issues) if you have suggestions on how to improve this information.

## Contributing and Developer Information

The community welcomes your involvement and contributions to this project. Please read the OpenEEW [contributing](https://github.com/openeew/openeew/blob/master/CONTRIBUTING.md) document for details on our code of conduct, and the process for submitting pull requests to the community.

## License

This information is licensed under the Apache Software License, Version 2. Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](http://www.apache.org/licenses/LICENSE-2.0.txt).
