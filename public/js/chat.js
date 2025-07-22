
let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        throw new Error('No hay token en el servidor');
    };

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: { 'x-token': token }
    })

    const { usuario: userDB, token: tokenDB } = await resp.json();

    usuario = userDB;
    document.title = usuario.name;

    await conectarSocket();
}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });
    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload);
    });

};

const dibujarUsuarios = (usuarios = []) => {
    let userHTML = '';
    usuarios.forEach(({ name, uid }) => {
        userHTML += `
            <li>
                <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });
    ulUsuarios.innerHTML = userHTML;
};

const dibujarMensajes = (mensajes = []) => {
    let mensajesHTML = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                <span class="text-primary">${nombre}: </span>
                <span>${mensaje}</span>
                </p>
            </li>
        `
    });
    ulMensajes.innerHTML = mensajesHTML;
};

txtMsg.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMsg.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; } // 13 es el ENTER
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMsg.value = '';

})

const main = async () => {

    await validarJWT();

};


main();
