const db = require('../utils/db');

exports.allDataCompanys = async () => {
    try {
        const [results] = await db.query('SELECT * FROM Companys');
        return results;
    } catch (error) {
        throw error;
    }

};

// exports.insertCompany = async (companyData) => {
//     try {
//         // Assuming companyData is a JSON object with properties matching your table columns
//         const query = 'INSERT INTO Companys () VALUES (?, ?, ?)';
//         const values = [companyData.column1, companyData.column2, companyData.column3];

//         // Execute the query with the values from the JSON object
//         const [results] = await db.query(query, values);
//         return results;
//     } catch (error) {
//         throw error;
//     }
// };