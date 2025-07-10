const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const userGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ state: true }),
        Usuario.find({ state: true })
            .limit(limite)
            .skip(desde)
    ])
    res.json({
        total,
        usuarios
    })
};
const userPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body

    // TODO: Validar con la BD

    if (password) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario)
};
const userPost = async (req = request, res = response) => {

    const { name, email, password, rol } = req.body;
    const usuario = new Usuario({ name, email, password, rol });

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    // Guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    })

};
const userDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borrmos
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrar cambiando estado
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false } )
    res.json(usuario)
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}