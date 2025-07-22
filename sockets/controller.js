const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket, io) => {

    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token)
    if (!usuario) {
        return socket.disconnect()
    }
    // Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Conectarlo a una sala especial
    socket.join( usuario.id ); // salas: global, socket.id, usuario.id

    // Limpiar cuando alguien se deconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if (uid){
            // Mensaje Privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.name, mensaje })
        }

        chatMensajes.enviarMensaje( usuario.id, usuario.name, mensaje );
        io.emit('recibir-mensajes', chatMensajes.ultimos10)

    })

}


// boradcast le manda a todos menos a el mismo
module.exports = {
    socketController
}