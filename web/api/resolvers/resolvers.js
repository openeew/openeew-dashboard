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
    stopEarthquakeTest: (_, { sensorId }, { dataSources }) => {
      return dataSources.mqttAPI.stopEarthquakeTest(sensorId);
    },
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
  },
};
