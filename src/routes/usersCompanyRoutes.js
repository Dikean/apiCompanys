const express = require('express');
const router = express.Router();
const usersCompanyController = require('../controllers/usersCompanyController');
const checkJwt = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/getAllUserCompany',checkJwt, checkRole('ModuloAuditoria_Administrador'), usersCompanyController.getAllUsersCompanies);
// Ruta protegida para eliminar un usuario
router.delete('/deleteUserCompany/:userId', checkJwt,checkRole('ModuloAuditoria_Administrador'), usersCompanyController.deleteUser);

module.exports = router;
