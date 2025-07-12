const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { adminRole } = require("../middlewares/validar-roles");
const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require("../controllers/productos");

const router = Router();

// Obtener todas los productos - Publico
router.get('/', obtenerProductos);

// Obtener un producto por id - Publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] , obtenerProducto);

// Crear producto - Privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
] , crearProducto);

// Actualizar registro por id - Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar producto solo si es admin - Admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto);


module.exports = router;