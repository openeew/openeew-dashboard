import gql from 'graphql-tag';

export const ACC_STREAM = gql`
  query {
    accStream {
      x
      y
      z
      device_t
    }
  }
`;
