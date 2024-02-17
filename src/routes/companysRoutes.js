const express = require('express');
const router = express.Router();
const companysController = require('../controllers/companysController');
const checkJwt = require('../middleware/authMiddleware');
const bucket = require('../utils/configFirebase'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configura el directorio temporal de almacenamiento

router.get('/getAllCompanys',checkJwt, companysController.getAllCompanys); //obtener todas las compañias
router.post('/createCompany', checkJwt, companysController.createCompany); //crear comapañia
router.put('/updateCompany',  companysController.updateCompany); //update Company
router.get('/byUser/:userId', checkJwt, companysController.getCompanysByUser); 
router.get('/byCompany/:CompanyId', checkJwt, companysController.getCompanysByID); 
router.get('/byUserCompanyChart/:userId', checkJwt, companysController.getCompanysByUserIdCity); 
router.get('/joinOneCompany', checkJwt, companysController.getCompanysByUserIdCity); 

router.delete('/deletDocumente', checkJwt, companysController.DeleteDoumentByID); 

//storage
router.post('/upload', upload.single('file'), companysController.Upload);
router.get('/getDocuments/:CompanyId', checkJwt, companysController.getDocumentsByIdFirebase);

//BotAi Siigo 
router.get('/BotAi-sales_invoices', companysController.getSalesInvoices);


// router.post('/upload', upload.single('file'), checkJwt, companysController.Upload);

module.exports = router;
