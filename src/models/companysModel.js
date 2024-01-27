const db = require('../utils/db');
const { bucket } = require('../utils/configFirebase'); 
const fs = require('fs');

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
        const queryCompany = 'INSERT INTO Companys (NameCompany, Date, Codigo, Ubicacion, Email, Access_key) VALUES (?, ?, ?, ?, ?, ?)';
        const valuesCompany = [companyData.NameCompany, companyData.Date, companyData.Codigo, companyData.Ubicacion, companyData.Email, companyData.Access_key];

        await db.query(queryCompany, valuesCompany);
        const [results] = await db.query('SELECT LAST_INSERT_ID() as CompanyId');
        const companyId = results[0].CompanyId;

        // Insertar en la tabla UserCompany
        const queryUserCompany = 'INSERT INTO UserCompany (CompanyId, UserId, Rol, Date) VALUES (?, ?, "Administrator", NOW())';
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

//Join One Company


//storage

exports.uploadFileToFirebase = async (file, companyId, UserID) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        //al agregar al lado el sub del usuario ya lo guarda por carpeta
        const fileName = `RepositoryDocumentsByCompany/${companyId}/`+Date.now() + file.originalname;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        const streamPromise = new Promise((resolve, reject) => {
            blobStream.on('error', error => reject(error));
            blobStream.on('finish', () => resolve());

            if (file.buffer) {
                // Si el archivo se almacena en un buffer
                console.log("Tamaño del buffer:", file.buffer.length);
                blobStream.end(file.buffer);
            } else {
                // Si el archivo se almacena en el disco
                const readStream = fs.createReadStream(file.path);
                readStream.pipe(blobStream);
            }
        });

        await streamPromise;
        await fileUpload.makePublic();

        const publicUrl = await fileUpload.publicUrl();

        // Inserta la ruta del archivo y el userID en la base de datos
        const query = "INSERT INTO Repository (CompanyId, rutadelarchivo, categoria, UserId, Date) VALUES (?, ?, ?, ?, NOW())";
        db.query(query, [companyId, publicUrl, "Rut", UserID], (err, result) => {
            if (err) throw err;
            console.log("Registro insertado en la base de datos", result);
        });

        return publicUrl;

        
        
    } catch (error) {
        console.error('Error al subir archivo a Firebase:', error);
        throw new Error('Error al subir archivo a Firebase');
    }
};

exports.getDocumentsByCompany= async (companyId) => {
    try {
        const query = `
            SELECT * 
            FROM Repository
            WHERE CompanyId = ?
        `;
        const [company] = await db.query(query, [companyId]);
        return company;
    } catch (error) {
        throw error;
    }
};

