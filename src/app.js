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
app.use(cors({
    origin: 'https://autoconta.online'
}));

// Usar rutas
app.use('/api/userscompany', usersCompanyRoutes);
app.use('/api/companys', companysController);
app.use('/api/auth0/getPermissionRole', permissionController);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


