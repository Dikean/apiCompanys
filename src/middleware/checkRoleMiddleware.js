const jwt = require('jsonwebtoken'); // Asegúrate de tener esta biblioteca

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Obtener el token del header
    const decoded = jwt.decode(token); // Decodificar el token

    const roles = decoded['https://miapp.com/roles']; // Obtener roles del token
    if (roles && roles.includes(requiredRole)) {
      next();
    } else {
      res.status(403).send('Acceso denegado');
    }
  };
};

module.exports = checkRole;
