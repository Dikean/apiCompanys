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
    const query = 'SELECT Rol FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
    const [rows] = await db.query(query, [companyId, userId]);
    return rows.length > 0 ? rows[0].Rol : null;
  } catch (error) {
    throw error;
  }
};

exports.updateRolInCompany = async (companyId, userId, IntegranteId, NewRol) => {
  try {
      // Primero, verifica el rol del usuario que realiza la acción
      const query = 'SELECT Rol FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
      const [rows] = await db.query(query, [companyId, userId]);
      const rolUsuario = rows.length > 0 ? rows[0].Rol : null;
      
      if (rolUsuario === 'Administrator') {
          // Si el usuario es un Administrador, procede a actualizar el rol del integrante
          const updateQuery = 'UPDATE UserCompany SET Rol = ? WHERE CompanyId = ? AND UserId = ?';
          await db.query(updateQuery, [NewRol, companyId, IntegranteId]);
          return 'Rol actualizado con éxito';
      } else {
          // Si el usuario no es un Administrador, no permite la actualización
          return 'No autorizado para actualizar el rol';
      }
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

      const query = 'SELECT Rol FROM UserCompany WHERE CompanyId = ? AND UserId = ?';
      const [rows] = await db.query(query, [companyId, userId]);
      const rolUsuario = rows.length > 0 ? rows[0].Rol : null;
    
      console.log("My rol"+rolUsuario);

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
};
  
  


