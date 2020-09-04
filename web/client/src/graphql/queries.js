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

export const MAX_ACC = gql`
  query {
    maxAcc
  }
`;
