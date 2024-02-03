var axios = require("axios").default;

// Paso 1: Obtener el Token de Acceso
var optionsToken = {
  method: 'POST',
  url: 'https://dev-w1j3tra2.us.auth0.com/oauth/token',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'QpjygzLewDJDBF9tO1JkkpW7e31QJpGX',
    client_secret: '{yourClientSecret}', // Asegúrate de reemplazar {yourClientSecret} con tu client_secret real
    audience: 'https://dev-w1j3tra2.us.auth0.com/api/v2/'
  })
};

axios.request(optionsToken).then(function (response) {
  console.log("Token de Acceso Obtenido: ", response.data.access_token);
  // Paso 2: Usar el Token de Acceso para obtener las permisiones del usuario
  var accessToken = response.data.access_token;
  var optionsPermissions = {
    method: 'GET',
    url: 'https://dev-w1j3tra2.us.auth0.com/api/v2/users/USER_ID/permissions', // Reemplaza USER_ID con el ID real del usuario
    headers: {authorization: `Bearer ${accessToken}`}
  };

  axios.request(optionsPermissions).then(function (response) {
    console.log("Datos de las Permisos: ", response.data);
  }).catch(function (error) {
    console.error("Error al obtener las permisos: ", error);
  });

}).catch(function (error) {
  console.error("Error al obtener el token de acceso: ", error);
});
