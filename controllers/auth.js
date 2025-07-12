const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - email'
            });
        }
        // Verificar si el usuario esta activo en la BD
        if ( !usuario.state ){
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - state: false'
            });
        }
        // Verificar constrseña
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - password'
            });
        }
        // Generar JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log('error👉', error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};


module.exports = {
    login
}