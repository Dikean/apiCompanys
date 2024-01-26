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
        const localUserId = companyData.userId; 
        
        delete companyData.userId; // Eliminar el userId del objeto companyData

        const companyId = await companysController.insertCompany(companyData, localUserId);
    

        res.status(201).json({ message: "Company and UserCompany created successfully", CompanyId: companyId ,  CompanyId: Codigo });
    } catch (error) {
        console.error("Error al realizar la solicitud a Auth0:", error.response ? error.response.data : error);
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

exports.getCompanysByUserIdCity = async (req, res) => {
    try {
        const userId = req.params.userId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getCompanysByUserIdCity(userId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.Upload = async (req, res) => {
    try {
        const file = req.file;
        const result = await companysController.uploadFileToFirebase(file);
        res.send({ fileUrl: result });
      } catch (error) {
        res.status(500).send(error);
      }
}

//storage
// exports.Upload= async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//       }
    
//       const blob = bucket.file(req.file.originalname);
//       const blobStream = blob.createWriteStream({
//         metadata: {
//           contentType: req.file.mimetype,
//         },
//       });
    
//       blobStream.on('error', (err) => res.status(500).send(err));
    
//       blobStream.on('finish', () => {
//         const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
//         res.status(200).send({ url: publicUrl });
//       });
    
//       blobStream.end(req.file.buffer);
// };

