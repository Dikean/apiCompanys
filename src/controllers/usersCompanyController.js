const usersCompanyModel = require('../models/usersCompanyModel');

exports.getAllUsersCompanies = async (req, res) => {
    try {
        const usersCompanies = await usersCompanyModel.findAll();
        res.json(usersCompanies);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAsociateByUserCompany = async (req, res) => {
    try {
        const usersCompanies = await usersCompanyModel.userAsociateByCompany();
        res.json(usersCompanies);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Lógica para eliminar un usuario
        // Puedes obtener el ID del usuario a eliminar de req.params.userId
        res.json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Lógica para actualizar un usuario
        // Puedes obtener los datos del usuario a actualizar de req.body
        res.json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.postUserByCompanyByAdmin = async (req, res) => {
    try {
        const CompanyId = req.body.CompanyId;
        const UserId = req.body.UserId;

        const userCompanys = await usersCompanyModel.getUserAdmin(CompanyId, UserId)
        res.json(userCompanys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getRolInCompany= async (req, res) => {
    try {
        const CompanyId = req.body.CompanyId;
        const UserId = req.body.UserId;

        const userCompanys = await usersCompanyModel.getRolInCompany(CompanyId,UserId )
        res.json(userCompanys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateRolInCompany= async (req, res) => {
    try {
        const CompanyId = req.body.CompanyId;
        const UserId = req.body.UserId;
        const IntegranteId = req.body.IntegranteId;
        const NewRol = req.body.Rol;

        const userCompanys = await usersCompanyModel.updateRolInCompany(CompanyId,UserId, IntegranteId, NewRol )
        res.json(userCompanys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteByCompanyUser = async (req,res) => {
    
    try {
        const CompanyId = req.body.CompanyId;
        const UserId = req.body.UserId;
        const IntegranteId = req.body.IntegranteId;

        const userCompanys = await usersCompanyModel.deleteUserByOneCompanyEspecific(CompanyId, UserId, IntegranteId)
        res.json(userCompanys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};





