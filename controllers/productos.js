const { response, request } = require("express");
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate

const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ state: true }),
        Producto.find({ state: true })
            .limit(limite)
            .skip(desde)
            .populate('usuario', 'name -_id')
            .populate('categoria', 'name -_id')
    ]);

    res.status(200).json({
        total,
        productos
    })

};

// obtenerCategoria - populate

const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto
                                    .findById(id)
                                    .populate('usuario', 'name -_id')
                                    .populate('categoria', 'name -_id');

    if (!producto) {
        return res.status(400).json({
            msg: 'El id del producto no existe'
        });
    }

    res.status(200).json({
        producto
    })

};

// actualizarProducto
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }).populate('categoria', 'name')

    res.json(producto);

}

// Eliminar Producto

const eliminarProducto = async (req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borrmos
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrar cambiando estado
    const producto = await Producto.findByIdAndUpdate(id, { state: false }, { new: true })

    res.json(producto);
};
// Crear Producto

const crearProducto = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();
    const { state, usuario, ...body } = req.body;

    const productoBD = await Producto.findOne({ name });

    if (productoBD) {
        return res.status(400).json({
            msg: `el producto ${name} ya existe`
        });
    }

    // Generar data a guardar
    const data = {
        name,
        usuario: req.usuario._id,
        ...body
    };

    const producto = new Producto(data);

    // Guardat en DB
    await producto.save();
    await producto.populate('usuario', 'name');
    await producto.populate('categoria', 'name');
    res.status(201).json({
        msg: 'Producto Creado',
        producto
    })
};


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProducto
}