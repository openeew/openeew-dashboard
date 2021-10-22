const { DataSource } = require('apollo-datasource');
const generator = require('generate-password');

const mqtt = require('mqtt');

let brokerId;
let mqttClientId;
let mqttUsername;
let mqttPassword;
let mqttPort;

if (
  process.env.MQTT_BROKER_ID &&
  process.env.MQTT_CLIENTID &&
  process.env.MQTT_USERNAME &&
  process.env.MQTT_PASSWORD &&
  process.env.MQTT_PORT
) {
  brokerId = process.env.MQTT_BROKER_ID;
  mqttClientId = process.env.MQTT_CLIENTID;
  mqttUsername = process.env.MQTT_USERNAME;
  mqttPassword = process.env.MQTT_PASSWORD;
  mqttPort = process.env.MQTT_PORT;
} else {
  const mqtt = require('../vcap-local.json').services.Mqtt;

  brokerId = mqtt.brokerId;
  mqttClientId = mqtt.clientId;
  mqttUsername = mqtt.username;
  mqttPassword = mqtt.password;
  mqttPort = mqtt.port;
}

// Generates a ID to add to end of Mqtt clientId
const clientUnique = generator.generate({
  length: 8,
  numbers: true,
  symbols: false,
});

let client;
let clientCredsPresent = false;

if (mqttClientId && mqttUsername && mqttPassword) {
  console.log('MQTT Unique ID:', clientUnique);
  clientCredsPresent = true;

  client = mqtt.connect(
    `mqtt://${brokerId}.messaging.internetofthings.ibmcloud.com`,
    {
      clientId: `${mqttClientId}:${clientUnique}`,
      username: mqttUsername,
      password: mqttPassword,
      port: mqttPort,
      keepalive: 60,
    },
  );

  client.on('connect', () => {
    console.log('MQTT client connected: ' + client.connected);
  });

  client.on('message', (topic, message) => {
    console.log('message is ' + message);
    console.log('topic is ' + topic);
  });

  client.on('error', (err) => {
    console.log(err);
  });
} else {
  console.log('MQTT not connected: No credentials found.');
  clientCredsPresent = false;
}

class MqttAPI extends DataSource {
  sendEarthquakeToSensor(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/earthquake/fmt/json`,
        '{Alarm:test}',
        { retain: true, qos: 1 },
      );

      return { success: true };
    }

    throw new Error('Mqtt client not connected');
  }

  stopEarthquakeTest(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/earthquake/fmt/json`,
        '{Alarm:false}',
        { retain: true, qos: 1 },
      );

      return { success: true };
    }

    throw new Error('Mqtt client not connected');
  }

  sendRestartSensor(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/forcerestart/fmt/json`,
        '{}',
        { retain: true, qos: 1 },
      );

      return { success: true };
    }

    throw new Error('Mqtt client not connected');
  }

  sensorUpdate(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/firmwarecheck/fmt/json`,
        '{}',
        { retain: true, qos: 1 },
      );

      return { success: true };
    }

    throw new Error('Mqtt client not connected');
  }

  send10Data(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/sendacceldata/fmt/json`,
        '{LiveDataDuration:10}',
        { retain: true, qos: 1 },
      );

      return { success: true };
    }

    throw new Error('Mqtt client not connected');
  }

  sendSensorReset(sensorId) {
    if (client.connected && clientCredsPresent) {
      client.publish(
        `iot-2/type/OpenEEW/id/${sensorId}/cmd/factoryreset/fmt/json`,
        '{}',
        { retain: true, qos: 1 },
      );

      return { id: sensorId };
    }

    throw new Error('Mqtt client not connected');
  }
}

module.exports = MqttAPI;
