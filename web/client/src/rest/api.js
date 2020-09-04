var axios = require('axios');

class API {
  resetStream() {
    axios({
      method: 'put',
      url: 'http://localhost:4000/_stream',
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

const api = new API();

export default api;
