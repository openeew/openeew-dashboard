const Cloudant = require('@cloudant/cloudant');
const { RESTDataSource } = require('apollo-datasource-rest');

const formatLatLong = (latlong) => {
  if (!latlong) {
    return null;
  }

  return Number.parseFloat(latlong).toFixed(2);
};

class SensorAPI extends RESTDataSource {
  constructor() {
    super();
    let url;
    let username;
    let password;

    if (process.env.CLOUDANT_URL && process.env.CLOUDANT_USERNAME) {
      url = process.env.CLOUDANT_URL;
      username = process.env.CLOUDANT_USERNAME;
      password = process.env.CLOUDANT_PASSWORD;
    } else {
      const secrets = require('../vcap-local.json').services.Cloudant_sensors;
      console.warn('Using vcap-local for Cloudant secrets');

      url = secrets.url;
      username = secrets.credentials.username;
      password = secrets.credentials.password;
    }

    this.cloudant = Cloudant({
      url,
      username,
      password,
    });
  }

  getAllSensors(uuid) {
    return new Promise((resolve) => {
      const db = this.cloudant.db.use('openeew-devices');

      db.find({ selector: {} }, function (err, result) {
        if (err) {
          throw err;
        }

        const sensors = result.docs.map((sensor) => ({
          id: sensor._id,
          activated: new Date(sensor.Activated),
          lastCheckin: new Date(sensor.LastCheckin),
          firmwareVer: sensor.firmware_ver,
          latitude:
            sensor.uuid === uuid
              ? sensor.latitude
              : formatLatLong(sensor.latitude),
          longitude:
            sensor.uuid === uuid
              ? sensor.longitude
              : formatLatLong(sensor.longitude),
          uuid: sensor.uuid,
          status: sensor.status,
          isUserOwner: sensor.uuid === uuid,
        }));

        return resolve(sensors);
      });
    });
  }
}

module.exports = SensorAPI;
