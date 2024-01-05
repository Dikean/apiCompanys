const express = require('express');
const router = express.Router();
const usersCompanyController = require('../controllers/usersCompanyController');
const checkJwt = require('../middleware/authMiddleware');
// const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/UserCompany/:userId', checkJwt, usersCompanyController.getAsociateByUserCompany);

module.exports = router;
