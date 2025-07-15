const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models');
const path = require('path');
const { existsSync, unlinkSync } = require("fs");
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const cargarArchivos = async (req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imagenes');
        res.json({ nombre })
    } catch (msg) {
        res.status(400).json({ msg })
    }
};

// const actualizarImagen = async (req = request, res = response) => {

//     const { id, coleccion } = req.params;

//     let modelo;

//     switch (coleccion) {
//         case 'usuarios':
//             modelo = await Usuario.findById(id);
//             if (!modelo) {
//                 return res.status(400).json({ msg: 'No existe el USUARIO con ese ID' })
//             }
//             break;
//         case 'productos':
//             modelo = await Producto.findById(id);
//             if (!modelo) {
//                 return res.status(400).json({ msg: 'No existe el PRODUCTO con ese ID' })
//             }
//             break;
//         default:
//             return res.status(500).json({
//                 msg: 'Se me olvido validar esto'
//             });
//     }

//     // Limpiar Imagenes previas
//     if (modelo.img) {
//         // Borrar la img del servidor
//         const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
//         if (existsSync(pathImg)) {
//             unlinkSync(pathImg); //Borra el archivo
//         }
//     }


//     const nombre = await subirArchivo(req.files, undefined, coleccion);
//     modelo.img = nombre;

//     await modelo.save();

//     res.json({
//         modelo
//     })

// };

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: 'No existe el USUARIO con ese ID' })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: 'No existe el PRODUCTO con ese ID' })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    // Limpiar Imagenes previas
    if (modelo.img) {
        const nomnreArr = modelo.img.split('/');
        const nombre = nomnreArr[nomnreArr.length - 1];
        const [ id_cloudinary ] = nombre.split('.');
        cloudinary.uploader.destroy( id_cloudinary );
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    })

};

const mostrarImagenes = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: 'No existe el USUARIO con ese ID' })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: 'No existe el PRODUCTO con ese ID' })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    // Limpiar Imagenes previas
    if (modelo.img) {
        // Borrar la img del servidor
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (existsSync(pathImg)) {
            return res.sendFile( pathImg )
        }
    };

    const pathNoImg = path.join(__dirname, '../assets/no-image.jpg', );
    res.sendFile( pathNoImg );
    
}


module.exports = {
    cargarArchivos,
    // actualizarImagen,
    mostrarImagenes,
    actualizarImagenCloudinary
}