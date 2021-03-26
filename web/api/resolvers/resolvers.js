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
    sensors: (_, __, { dataSources, user }) => {
      // TODO: Admin check here
      const uuid = user.identities.filter(
        (iden) => iden.provider === 'cloud_directory',
      )[0].id;

      return dataSources.sensorAPI.getAllSensors(uuid);
    },
  },
};
