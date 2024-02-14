const permissionController = require('../models/permissionModel');
const axios = require('axios');

exports.getAllCompanys = async (req, res) => {
    try {
        const roleId = req.body.roles; // Asume que el array de roles viene en el cuerpo de la solicitud
        const companys = await permissionController.getPermissions(roleId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};