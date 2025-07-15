const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivos, mostrarImagenes, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarArchivo } = require("../middlewares/validar-archivo");


const router = Router();

router.post('/',validarArchivo, cargarArchivos);

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    validarArchivo,
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagenes)

module.exports = router;