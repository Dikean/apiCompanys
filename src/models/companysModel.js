const db = require('../utils/db');

exports.allDataCompanys = async () => {
    try {
        const [results] = await db.query('SELECT * FROM Companys');
        return results;
    } catch (error) {
        throw error;
    }

};

exports.insertCompany = async (companyData, userId) => {
    try {
        // Insertar en la tabla Companys
        const queryCompany = 'INSERT INTO Companys (NameCompany, Date, Codigo, Email, Access_key) VALUES (?, ?, ?, ?, ?)';
        const valuesCompany = [companyData.NameCompany, companyData.Date, companyData.Codigo, companyData.Email, companyData.Access_key];

        await db.query(queryCompany, valuesCompany);
        const [results] = await db.query('SELECT LAST_INSERT_ID() as CompanyId');
        const companyId = results[0].CompanyId;

        // Insertar en la tabla UserCompany
        const queryUserCompany = 'INSERT INTO UserCompany (CompanyId, UserId) VALUES (?, ?)';
        const valuesUserCompany = [companyId, userId];

        await db.query(queryUserCompany, valuesUserCompany);

        return companyId;
    } catch (error) {
        throw error;
    }
};

exports.updateCompany = async (companyId, companyData) => {
    try {
        const query = 'UPDATE Companys SET NameCompany = ?, Date = ?, Codigo = ?, Email = ?, Access_key = ? WHERE CompanyId = ?';
        const values = [companyData.NameCompany, companyData.Date, companyData.Codigo, companyData.Email, companyData.Access_key, companyId];

        // Ejecutar la consulta preparada
        const [results] = await db.query(query, values);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.getCompanysByUserId = async (userId) => {
    try {
        const query = `
            SELECT Companys.* 
            FROM Companys
            JOIN UserCompany ON Companys.CompanyId = UserCompany.CompanyId
            WHERE UserCompany.UserId = ?
        `;
        const [companys] = await db.query(query, [userId]);
        return companys;
    } catch (error) {
        throw error;
    }
};

exports.getCompanysByUserIdCity = async (userId) => {
    try {
        const query = `
            SELECT Companys.Ubicacion 
            FROM Companys
            JOIN UserCompany ON Companys.CompanyId = UserCompany.CompanyId
            WHERE UserCompany.UserId = ?
        `;
        const [companys] = await db.query(query, [userId]);

        // Calcular los porcentajes
        const cityCounts = companys.reduce((acc, company) => {
            acc[company.Ubicacion] = (acc[company.Ubicacion] || 0) + 1;
            return acc;
        }, {});

        const total = companys.length;
        const cityPercentages = Object.keys(cityCounts).map(city => ({
            city,
            percentage: (cityCounts[city] / total) * 100
        }));

        return cityPercentages;
    } catch (error) {
        throw error;
    }
};

exports.getCompanyById = async (companyId) => {
    try {
        const query = `
            SELECT * 
            FROM Companys
            WHERE CompanyId = ?
        `;
        const [company] = await db.query(query, [companyId]);
        return company;
    } catch (error) {
        throw error;
    }
};
