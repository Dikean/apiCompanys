const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Cargar las variables de entorno
dotenv.config();

// Importar rutas
const usersCompanyRoutes = require('./routes/usersCompanyRoutes');
const companysController = require('./routes/companysRoutes')
const db = require('./utils/db');
// Otros imports de rutas...

const app = express();

// Middleware para parsear el body
app.use(express.json());

// Configurar CORS para permitir solicitudes de cualquier origen
app.use(cors());

// Usar rutas
app.use('/api/userscompany', usersCompanyRoutes);
app.use('/api/companys', companysController);

app.get('/get-user-permissions', async (req, res) => {
    const userId = "google-oauth2|108903769150858179970"; // Obtiene el userId de los parámetros de la ruta

    // Configuración para obtener el token
    var optionsToken = {
        method: 'POST',
        url: 'https://dev-w1j3tra2.us.auth0.com/oauth/token',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'in8vha00TxNfLFN1BbvQIOfCHm1h5SiB',
            client_secret: 'IWA9OHErN3vYDQz4ydaMJl664NDU7plE0SBwAd8-_JcIkeA98YIJ-t-rAgNpv3dD', // Reemplaza esto con tu client_secret real
            audience: 'https://dev-w1j3tra2.us.auth0.com/api/v2/'
        })
    };

    try {
        // Solicita el token de acceso
        const tokenResponse = await axios.request(optionsToken);
        const accessToken = tokenResponse.data.access_token;

        // Configuración para obtener las permisiones del usuario con el token de acceso
        var optionsPermissions = {
            method: 'GET',
            url: `https://dev-w1j3tra2.us.auth0.com/api/v2/users/${userId}/permissions`,
            headers: {authorization: `Bearer ${accessToken}`}
        };

        // Solicita las permisiones del usuario
        const permissionsResponse = await axios.request(optionsPermissions);
        res.json(permissionsResponse.data); // Envía las permisiones como respuesta
    } catch (error) {
        console.error("Error en la solicitud: ", error);
        res.status(500).send("Error interno del servidor");
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


