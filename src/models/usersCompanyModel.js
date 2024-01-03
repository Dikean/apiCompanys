const db = require('../utils/db');

exports.findAll = async () => {
    try {
        // Preparar la consulta SQL sin datos específicos
        const sql = 'SELECT * FROM UsersCompany';

        // Ejecutar la consulta preparada
        const [results] = await db.query(sql); // Aquí no se pasan parámetros porque la consulta no los requiere

        return results;
    } catch (error) {
        throw error;
    }
};

    exports.userAsociateByCompany = async () => {
        try {
            // Preparar la consulta SQL sin datos específicos
            const sql = `
            SELECT u.*
            FROM UsersCompany uc
            JOIN Users u ON uc.UserID = u.UserID
            WHERE uc.CompanyId = ?;
            `;
    
            // Ejecutar la consulta preparada
            const [results] = await db.query(sql); // Aquí no se pasan parámetros porque la consulta no los requiere
    
            return results;
        } catch (error) {
            throw error;
        }

};


