const express = require('express');
const router = express.Router();
const companysController = require('../controllers/companysController');
const checkJwt = require('../middleware/authMiddleware');

router.get('/getAllCompanys',checkJwt, companysController.getAllCompanys); //obtener todas las compañias
router.post('/createCompany', checkJwt, companysController.createCompany); //crear comapañia
router.put('/updateCompany', checkJwt, companysController.updateCompany); //update Company
router.get('/byUser/:userId', checkJwt, companysController.getCompanysByUser); //company by user
router.get('/byCompany/:CompanyId', checkJwt, companysController.getCompanysByID); //company by user
router.get('/byUserCompanyChart/:userId', checkJwt, companysController.getCompanysByUserIdCity); //company by user

module.exports = router;
