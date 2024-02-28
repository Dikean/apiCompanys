const db = require('../utils/db');


async function getRolByUser(companyId, userId) {
    try {
      const query = 'SELECT Rol FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
      const [rows] = await db.query(query, [companyId, userId]);
      return rows.length > 0 ? rows[0].Rol : null;
    } catch (error) {
      throw error;
    }
}

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


exports.getRolInCompany = async (companyId, userId) => {
    try {
        // La consulta SQL verifica el rol basado en companyId y userId proporcionados
        const query = 'SELECT Rol FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
        // Asegúrate de pasar companyId y userId a la consulta
        const [rows] = await db.query(query, [companyId, userId]);
        // Retorna el rol si se encuentra, de lo contrario retorna null
        return rows.length > 0 ? rows[0].Rol : null;
    } catch (error) {
        // Maneja cualquier error que ocurra durante la ejecución de la consulta
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

exports.getUserAdmin = async (companyId, userId) => {
    try {
      const rolUsuario = await getRolByUser(companyId, userId);
      if (rolUsuario === 'Administrator') {
        // El usuario es administrador, proceder a obtener los usuarios de la compañía
        const query = 'SELECT UserId, Rol, Date,UserPhoto,Email FROM UserCompany WHERE CompanyId = ?';
        const [usuarios] = await db.query(query, [companyId]);
        return usuarios;
      } else {
      }
    } catch (error) {
      throw error;
    }
  };

exports.deleteUserByOneCompanyEspecific = async(companyId, userId, integranteId) =>{
    try {
      const rolUsuario = await getRolByUser(companyId, userId);
      if (rolUsuario === 'Administrator') {

          // Lógica para eliminar un integrante
          const query = 'DELETE FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
          await db.query(query, [companyId, integranteId]);
          return 'Integrante eliminado con éxito';
        
      } else {
        throw new Error('No tienes permisos para realizar esta acción');
      }
    } catch (error) {
      throw error;
    }
  }
  
  


