function dataStreamSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator('NEW_ACC_DATA');
}

const newAccData = {
  subscribe: dataStreamSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newAccData,
};
