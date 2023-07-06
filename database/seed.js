const dotenv = require('dotenv');
require('dotenv').config();

dotenv.config({ path: '../.env' });

const connection = require('./db');

// Configuración de la conexión a la base de datos

// Datos para insertar en la tabla de usuarios
const usersData = [
  {
    id: 1,
    email: 'fabian@remotepcsolutions.com',
    password: '$2a$08$paBdu/C8ozojPSpZ7SwDAOq9gDQOOp0PqNGmNnNQ0QW4kuAGFkpCG',
    reset_token: null,
    reset_token_expires: null,
  },
  {
    id: 7,
    email: 'espejofabian@gmail.com',
    password: '$2a$08$.Fz9YgNME5NizdeeiNIbb.M38FXvXGBWQm3/pe5ROtLj2LpetLCyu',
    reset_token: '71524efb354537f0ab7f097053e7a538c1af284e',
    reset_token_expires: null,
  },
];

// Función para insertar los datos en la base de datos
function seed() {
  // Ejecutar la sentencia SQL para crear la tabla users (si no existe)
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT(11) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      reset_token VARCHAR(255) DEFAULT NULL,
      reset_token_expires DATETIME DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY email (email)
    )
  `;

  return new Promise((resolve, reject) => {
    // Ejecutar la sentencia de creación de tabla
    connection.query(createTableQuery, (error) => {
      if (error) {
        console.error('Error al crear la tabla users:', error);
        reject(error);
        return;
      }

      // Iterar sobre los datos y ejecutar la sentencia SQL de inserción
      usersData.forEach((user) => {
        const { id, email, password, reset_token, reset_token_expires } = user;
        const insertQuery = `
          INSERT INTO users (id, email, password, reset_token, reset_token_expires)
          VALUES (?, ?, ?, ?, ?)
        `;
        const values = [id, email, password, reset_token, reset_token_expires];
        connection.query(insertQuery, values, (error) => {
          if (error) {
            console.error('Error al insertar el usuario:', error);
          } else {
            console.log('Usuario insertado:', user);
          }
        });
      });

      resolve();
    });
  });
}

// Ejecutar la función de seed
seed().catch((error) => {
  console.error('Ocurrió un error al ejecutar el seed:', error);
}).finally(() => {
  // Cerrar la conexión a la base de datos al finalizar
  connection.end();
});
