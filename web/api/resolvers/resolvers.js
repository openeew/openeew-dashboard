const { GraphQLDateTime } = require('graphql-iso-date');
const {
  UUIDResolver,
  LatitudeResolver,
  LongitudeResolver,
} = require('graphql-scalars');

module.exports = {
  DateTime: GraphQLDateTime,
  UUID: UUIDResolver,
  Latitude: LatitudeResolver,
  Longitude: LongitudeResolver,

  Query: {
    sensors: (_, __, { dataSources }) => {
      // Admin check here

      return dataSources.sensorAPI.getAllSensors();
    },
  },
};
