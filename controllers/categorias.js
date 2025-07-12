const { response, request } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ state: true }),
        Categoria.find({ state: true })
            .limit(limite)
            .skip(desde)
            .populate('usuario', 'name')
    ]);

    res.status(200).json({
        total,
        categorias
    })

};

// obtenerCategoria - populate

const obtenerCategoria = async( req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'name');

    if ( !categoria ) {
        return res.status(400).json({
            msg: 'El id de la categoria no existe'
        });
    }
    
    res.status(200).json({
        categoria
    })

};

// actualizarCategoria
const actualizarCategoria = async( req = request, res = response ) =>{

    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } )

    res.json(categoria);

}

// Eliminar Categoria

const eliminarCategoria = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borrmos
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrar cambiando estado
    const categoria = await Categoria.findByIdAndUpdate( id, { state: false }, { new: true } )
    
    res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({ name });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${name} ya existe`
        });
    }

    // Generad data a guardar
    const data = {
        name,
        usuario: req.usuario._id
    };

    const categoria = new Categoria(data);

    // Guardat en DB
    await categoria.save();

    res.status(201).json({
        msg: 'Categoria Creada',
        categoria
    })
};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}