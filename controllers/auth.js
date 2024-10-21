const {response} = require('express');
const winston = require('winston');
const mongoose = require('mongoose'); 
const path = require('path'); 
const {errorSchema} = require('../schemas/schemas');
const { generarJWT } = require('../helpers/generar-jwt');
const {usuarioSchema} = require('../schemas/schemas');

//Generar la Conexón a MongoDB
mongoose.connect('mongodb://localhost:27017/vuejs');

// Creación de Modelos 
const ErrorLog = mongoose.model('ErrorLog', errorSchema);

// Creación de Modelo
const Usuario = mongoose.model('Usuarios',usuarioSchema);

/**
 * Define la funcionalidad para buscar un usuario en mongo con correo y password indicados
 * @param {*} req 
 * @param {*} res 
 */
const login = (async(req, res = response)=>{
    try{
        const {correo, password} = req.body;
        const usuario = await Usuario.findOne({correo, password});
        console.log(`\nEl usuario ${correo} se está intentando loguear...`);
        if(usuario){
            console.log(`Login correcto.`);
            //Se genera un JWT con el ID del usuario creado
            const token = await generarJWT(usuario._id);
            //Se envía el token en el encabezado de la respuesta
            res.header('x-token', token);
            console.log(`Token enviado en el header: ${token}`);
            //Se envía el usuario en la respuesta
            res.json(usuario);
        }else{
            res.status(401).json({mensaje: 'Credenciales inválidas'});
        }
    }catch(error){
        console.error('Error en el logueo de usuario', error);
        res.status(500).json({mensaje: 'Error interno en el servidor'});

    }
});


// Configuración de winston
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') })
  ]
});

//Almacena el log de errores del cliente en la base de datos
const log_errors = ((req, res = response) => {
    const { error, info, url } = req.body;
    const errorLog = new ErrorLog({ error, info, url });
    errorLog.save()
      .then(() => {
        logger.error(`Error: ${error}, Info: ${info}, URL: ${url}`);
        res.status(200).send('Error logged');
      })
      .catch(err => {
        res.status(500).send('Failed to log error');
      });
  });

  module.exports = {
    login,
    log_errors
  }