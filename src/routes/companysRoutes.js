const express = require('express');
const router = express.Router();
const companysController = require('../controllers/companysController');
const checkJwt = require('../middleware/authMiddleware');

router.get('/getAllCompanys',checkJwt, companysController.getAllCompanys);
// router.post('/createCompanys',checkJwt, companysController.);

module.exports = router;
