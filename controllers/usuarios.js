const { response, request } = require("express")


const userGet = (req = request, res = response) => {

    const { nombre } = req.query;

    res.json({
        msg: 'get API - controlador',
        nombre
    })
};
const userPut = (req = request, res = response) => {

    const {id} = req.params;

    res.status(400).json({
        msg: 'put API - controlador',
        "id": id
    })
};
const userPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - controlador',
        nombre,
        edad
    })

};
const userDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    })
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}