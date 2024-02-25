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
        const localUserId = req.body.userId; 

        const companyId = await companysController.insertCompany(companyData, localUserId);
    

        res.status(201).json({ message: "Company and UserCompany created successfully", CompanyId: companyId });
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

exports.DeleteDoumentByID = async (req, res) => {
    try {
        const userId = req.body.id; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.deleteDocumentById(userId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.postJoinOneCompany = async (req, res) => {
    try {
        const Codigo = req.body.Codigo; 
        const UserID = req.body.UserId; 
        const companys = await companysController.joinCompany(Codigo,UserID);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Storage

exports.Upload = async (req, res) => {
    try {

        const file = req.file;
        const companyId = req.body.companyId;
        const name = req.body.name;
        const category = req.body.category;
        const UserId = req.body.UserId;
        const result = await companysController.uploadFileToFirebase(file, companyId, UserId, name, category) ;
        res.send({ fileUrl: result });
      } catch (error) {
        res.status(500).send(error);
      }
}

exports.getDocumentsByIdFirebase = async (req,res)=>{
    try {
        const CompanyID = req.params.CompanyId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getDocumentsByCompany(CompanyID);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Siigo
exports.getTokenSiigo= async (req, res) => {
    try {
        const { username, access_key } = req.body;
        const companys = await companysController.getTokenSiigo(username, access_key);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


exports.getSalesInvoices = async (req, res) => {
    try {
        const CompanyId = req.body.CompanyId; 
        const Messages = req.body.Messages; 
        const companys = await companysController.getSalesInvocesSiigo(CompanyId, Messages);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
