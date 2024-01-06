const companysController = require('../models/companysModel');

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
        const userId = companyData.userId; // Extrae el ID del usuario del cuerpo de la solicitud
        // Asegúrate de eliminar el userId del objeto companyData antes de pasarlo
        delete companyData.userId;

        const companyId = await companysController.insertCompany(companyData, userId);
        res.status(201).json({ message: "Company and UserCompany created successfully", CompanyId: companyId });
    } catch (error) {
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
