module.exports = (server) => {
  server.express.put('/test', (req, res) => {
    // Test REST route

    res.send('test route worked');
  });
};
