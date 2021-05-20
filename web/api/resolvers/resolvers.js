const { GraphQLDateTime } = require('graphql-iso-date');
const {
  UUIDResolver,
  LatitudeResolver,
  LongitudeResolver,
} = require('graphql-scalars');
const {
  AuthenticationError,
  UserInputError,
} = require('apollo-server-express');

module.exports = {
  DateTime: GraphQLDateTime,
  UUID: UUIDResolver,
  Latitude: LatitudeResolver,
  Longitude: LongitudeResolver,

  Query: {
    sensors: (_, __, { dataSources, uuid }) => {
      // TODO: Admin check here

      return dataSources.sensorAPI.getAllSensors(uuid);
    },
  },
  Mutation: {
    /**
     * Send earthquake test
     */
    sendEarthquakeToSensor: async (_, { sensorId }, { dataSources, uuid }) => {
      const sensor = await dataSources.sensorAPI.getSensorById(sensorId);

      if (!sensor) {
        throw new UserInputError('Sensor not found');
      }

      if (sensor.uuid !== uuid) {
        throw new AuthenticationError('Unauthorized');
      }

      return dataSources.mqttAPI.sendEarthquakeToSensor(sensorId);
    },

    /**
     * Stop earthquake test
     */
    stopEarthquakeTest: (_, { sensorId }, { dataSources }) => {
      return dataSources.mqttAPI.stopEarthquakeTest(sensorId);
    },

    /**
     * Request an update of sensor firmware
     */
    sendSensorUpdateRequest: (_, { sensorId }, { dataSources }) => {
      return dataSources.mqttAPI.sensorUpdate(sensorId);
    },

    /**
     * Restart a sensor
     */
    sendRestartSensor: async (_, { sensorId }, { dataSources, uuid }) => {
      const sensor = await dataSources.sensorAPI.getSensorById(sensorId);

      if (!sensor) {
        throw new UserInputError('Sensor not found');
      }

      if (sensor.uuid !== uuid) {
        throw new AuthenticationError('Unauthorized');
      }

      return dataSources.mqttAPI.sendRestartSensor(sensorId);
    },

    /**
     * Restart a sensor
     */
    send10Data: (_, { sensorId }, { dataSources }) => {
      return dataSources.mqttAPI.send10Data(sensorId);
    },

    /**
     * Remove a sensor
     */
    sendSensorRemove: async (_, { sensorId }, { dataSources, uuid }) => {
      const sensor = await dataSources.sensorAPI.getSensorById(sensorId);

      if (!sensor) {
        throw new UserInputError('Sensor not found');
      }

      if (sensor.uuid !== uuid) {
        throw new AuthenticationError('Unauthorized');
      }

      try {
        await dataSources.sensorAPI.removeSensor(sensorId);
      } catch (error) {
        throw new Error('REMOVE_SENSOR_ERROR');
      }

      return dataSources.mqttAPI.sendSensorReset(sensorId);
    },
  },
};
