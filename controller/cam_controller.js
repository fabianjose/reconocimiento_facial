// Invocamos a logger
const logger = require('../log/logger');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
const connection = require('../database/db');
const session = require('express-session');
const moment = require('moment');
const controller = {};

controller.activarCam = async (req, res) => {
  res.render('camara');
};

controller.guardardatos = async (req, res) => {
  console.log('prueba de post en fetch');
  console.log(req.body);

  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Operación exitosa');
    }, 2000);
  });

  console.log(result);

  const { user, password } = req.body;

  connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields) => {
    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      res.send('Datos guardados correctamente');
    } else {
      // Realiza otras acciones o guarda los datos en la base de datos
    }
  });
};



controller.mostrardatos = async (req, res) => {
  const { email, fechaInicio, fechaFin } = req.query;
  const sql = 'SELECT rf.user_id, u.nombre, AVG(rf.sorprendido) AS promedioSorprendido, AVG(rf.neutral) AS promedioNeutral, AVG(rf.feliz) AS promedioFeliz, AVG(rf.triste) AS promedioTriste, AVG(rf.enojado) AS promedioEnojado, AVG(rf.disgustado) AS promedioDisgustado FROM reconocimiento_facial rf INNER JOIN users u ON rf.user_id = u.id GROUP BY rf.user_id';

  // Ejecutar la consulta
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      // Manejar el error de la consulta
      res.status(500).json({ message: 'Error al obtener los registros' });
    } else {
      // Éxito en la consulta
      res.render('resultados', { resultados: results });
    }
  });
};







module.exports = controller;
