const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { adminRole } = require("../middlewares/validar-roles");

const router = Router();

// Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - Publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] , obtenerCategoria);

// Crear Categoria - Privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria);

// Actualizar registro por id - Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar categoria solo si es admin - Admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarCategoria);


module.exports = router;