const Role = require("../models/role");
const Usuario = require("../models/usuario");



const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El Rol ${rol} no esta registrado como valido`)
    }
};

const emailExiste = async (email = '') => {

    const existEmail = await Usuario.findOne({ email });
    if (existEmail) {
        throw new Error(`El Email ${email} ya esta registrado`)
    };
};

const existeUserPorId = async (id = '') => {

    const existeUsuario = await Usuario.findById( id );
    if (!existeUsuario) {
        throw new Error(`El ID ${id} no esta registrado`)
    };
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUserPorId
}