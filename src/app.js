const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const openai = require('openai');
// Cargar las variables de entorno
dotenv.config();

// Importar rutas
const usersCompanyRoutes = require('./routes/usersCompanyRoutes');
const companysController = require('./routes/companysRoutes');
const permissionController = require('./routes/auth0PermissionRoutes');


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
app.use('/api/auth0/getPermissionRole', permissionController);

// La función getTokenSiigo como se definió anteriormente
async function getTokenSiigo(username, access_key) {
    try {
        const response = await axios.post('https://api.siigo.com/auth', {
            username: username,
            access_key: access_key
        });

        const token = response.data; // Asumiendo que el token viene directamente en el cuerpo de la respuesta
        console.log("Token obtenido:", token);
        return token;
    } catch (error) {
        console.error("Error al obtener el token de Siigo:", error);
        throw error;
    }
}

// Ruta para probar getTokenSiigo
app.post('/get-token', async (req, res) => {
    const { username, access_key } = req.body;
    try {
        const token = await getTokenSiigo(username, access_key);
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


