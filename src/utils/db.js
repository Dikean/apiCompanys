
const express = require('express');
const mysql = require('mysql2');

const app = express();
// Configuración de la base de datos
const pool = mysql.createPool({
    host: 'smilesonline.online',
    user: 'u958352070_Api_Conta',
    password:  '9&Bfj75w',
    database:  'u958352070_Api_GeneralCon'
});

// Conexión al pool de conexiones
const db = pool.promise(); // Usar el pool en modo promesa


db.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
  connection.release();
});


module.exports = db;
