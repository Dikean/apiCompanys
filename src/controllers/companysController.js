const companysController = require('../models/companysModel');
const axios = require('axios');


exports.getAllCompanys = async (req, res) => {
    try {
        const companys = await companysController.allDataCompanys();
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        const localUserId = companyData.userId; // ID del usuario en tu sistema
        delete companyData.userId; // Eliminar el userId del objeto companyData
        const companyId = await companysController.insertCompany(companyData, localUserId);

        
        // Datos del usuario para Auth0
        const userData = {
            email: companyData.Email,
            password: companyData.Email, // Usando el email como contraseña
            connection: 'Username-Password-Authentication'
        };

        // Obtener el token de la cabecera Authorization
        if (!req.headers.authorization) {
            return res.status(401).send('No authorization token provided');
        }
        const token = req.headers.authorization.split(' ')[1];
        
         // Imprimir el token en la consola para depuración
        //  console.log("Token recibido:", token);

        // Crear usuario en Auth0
        const auth0Response = await axios.post('https://dev-w1j3tra2.us.auth0.com/api/v2/users', userData, {
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
              
        });
    
        // Obtener el ID del usuario creado en Auth0
        const auth0UserId = auth0Response.data.user_id;
    
        // ID del rol a asignar
        const roleId = 'rol_g3SUmI4drIpWyvH3'; // Reemplaza con el ID del rol que quieres asignar
        const roleData = {
            roles: [roleId]
        };
    
        // Asignar rol al usuario en Auth0
        await axios.post(`https://dev-w1j3tra2.us.auth0.com/api/v2/users/${auth0UserId}/roles`, roleData, {
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
              
        });
    
        res.status(201).json({ message: "Company and UserCompany created successfully", CompanyId: companyId });
    } catch (error) {
        console.log("Error al realizar la solicitud a Auth0:", error.response.data);
        res.status(500).send(error.message);
    }
};    


exports.updateCompany = async (req, res) => {
    try {
        const companyData = req.body; // Datos de la compañía para actualizar
        const companyId = companyData.CompanyId; // Asegúrate de que el ID de la compañía esté incluido en el cuerpo de la solicitud

        // Llama a una función del modelo para actualizar la compañía
        const result = await companysController.updateCompany(companyId, companyData);
        res.status(200).json({ message: "Company updated successfully", result });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getCompanysByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getCompanysByUserId(userId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCompanysByID= async (req, res) => {
    try {
        const CompanyId = req.params.CompanyId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getCompanyById(CompanyId)
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCompanysByUserIdCity= async (req, res) => {
    try {
        const userId = req.params.userId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getCompanysByUserIdCity(userId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


//storage
exports.Upload= async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
    
      blobStream.on('error', (err) => res.status(500).send(err));
    
      blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
        res.status(200).send({ url: publicUrl });
      });
    
      blobStream.end(req.file.buffer);
};

