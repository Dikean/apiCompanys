const express = require('express');
const router = express.Router();
const usersCompanyController = require('../controllers/usersCompanyController');
const checkJwt = require('../middleware/authMiddleware');
const { userAsociateByCompany } = require('../models/usersCompanyModel');
// const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/UserCompany/:userId', checkJwt, usersCompanyController.getAsociateByUserCompany);
router.post('/getUserByAdmin',  usersCompanyController.postUserByCompanyByAdmin);
router.post('/getRolInCompany' ,  usersCompanyController.getRolInCompany);

router.delete('/deleteUserByAdminCompany' , checkJwt, usersCompanyController.deleteByCompanyUser);

module.exports = router;
