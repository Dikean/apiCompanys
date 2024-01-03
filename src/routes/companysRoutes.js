const express = require('express');
const router = express.Router();
const companysController = require('../controllers/companysController');
const checkJwt = require('../middleware/authMiddleware');

router.get('/getAllCompanys',checkJwt, companysController.getAllCompanys);

module.exports = router;
