const express = require('express');
const router = express.Router();
const connection = require('../database/db'); // Importa la conexión a la base de datos
const camaraController = require('../controller/cam_controller')
const authMiddleware = require('../middleware/authMiddleware')


// Ruta para mostrar la página con la cámara
/* router.get('/camara', (req, res) => {
  res.render('camara');
}); */
router.get('/camara',camaraController.activarCam)

// Ruta para procesar los datos de reconocimiento facial
router.post('/camara', (req, res) => {
let id = req.session.user_id

  const emocion = req.body.emociones; // Obtén la emoción capturada desde el formulario
  const image = req.body.image; // Obtén la imagen capturada desde el formulario
  // Inserta los datos en la tabla reconocimiento_facial
  
  const sql = `
  INSERT INTO reconocimiento_facial (user_id,neutral, feliz, triste, enojado, disgustado, sorprendido)
  VALUES (?,?, ?, ?, ?, ?, ?)
`;

const values = [
  user_id = id,
  emocion.Neutral,
  emocion.Feliz,
  emocion.Triste,
  emocion.Enojado,
  emocion.Disgustado,
  emocion.Sorprendido
];


  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      // Manejar el error de inserción
      res.status(500).json({ message: 'Error al guardar las emociones en la base de datos' });
    } else {
      // Éxito en la inserción
      res.status(200).json({ message: 'Emociones guardadas correctamente en la base de datos' });
    }
  }); 
})


router.get('/mostrardatos',camaraController.mostrardatos)


module.exports = router;
