const { response, request } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = isValidObjectId(termino); // TRUE or FALSE

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    };

    const regex = new RegExp( termino, 'i' )

    const usuarios = await Usuario.find( {
        $or: [ {name: regex, state: true}, {email: regex, state: true} ],
        // $and: [{ state: true }]
    } );
    res.json({
            results: usuarios
        });
};

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = isValidObjectId(termino); // TRUE or FALSE

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    };

    const regex = new RegExp( termino, 'i' )

    const categorias = await Categoria.find( {name: regex, state: true} );
    res.json({
            results: categorias
        });
};

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = isValidObjectId(termino); // TRUE or FALSE

    if ( esMongoID ) {
        const producto = await Producto.findById( termino );
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    };

    const regex = new RegExp( termino, 'i' )

    const productos = await Producto.find( {name: regex, state: true} );
    res.json({
            results: productos
        });
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino,  res);
            break;
        case 'categorias':
            buscarCategorias( termino, res )
            break;
        case 'productos':
            buscarProductos( termino, res )
            break;
        default:
            res.status(500).json({
                msg: 'No existe esta busqueda por ahora'
            })
    }

};

module.exports = {
    buscar
}