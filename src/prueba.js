var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://dev-w1j3tra2.us.auth0.com/oauth/token',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'in8vha00TxNfLFN1BbvQIOfCHm1h5SiB',
    client_secret: 'IWA9OHErN3vYDQz4ydaMJl664NDU7plE0SBwAd8-_JcIkeA98YIJ-t-rAgNpv3dD',
    audience: 'https://dev-w1j3tra2.us.auth0.com/api/v2/'
  })
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});