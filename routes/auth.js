const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login, renovarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post('/login', [
    check('email', 'El Correo es obligatorio').isEmail(),
    check('password', 'La constraseña es obligatoria').not().isEmpty(),
    validarCampos
] ,login);

router.get('/', validarJWT, renovarToken)


module.exports = router;