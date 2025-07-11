const { Router } = require("express");
const { userGet, userPut, userPost, userDelete } = require("../controllers/usuarios");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { esRoleValido, emailExiste, existeUserPorId } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { adminRole, tieneRole } = require("../middlewares/validar-roles");

const router = Router();

router.get('/', userGet);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUserPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], userPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo valido').isEmail().custom(emailExiste),
    check('password', 'Debe ser una constraseña valida').isLength({ min: 6 }),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], userPost);

router.delete('/:id', [
    validarJWT,
    // adminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUserPorId),
    validarCampos
] , userDelete);


module.exports = router;