const companysController = require('../models/companysModel');

exports.getAllCompanys = async (req, res) => {
    try {
        const companys = await companysController.allDataCompanys();
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
