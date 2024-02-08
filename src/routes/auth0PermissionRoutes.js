const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const checkJwt = require('../middleware/authMiddleware');
// const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/getrole', checkJwt, permissionController.getAllCompanys);

module.exports = router;
