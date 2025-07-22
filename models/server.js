const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        };
        // Conectar a BD
        this.database();
        // Middlewares
        this.middlewares();
        // Rutas de mi App
        this.routes();
    }

    async database() {
        await dbConnection();
    }

    middlewares() {

        // Directorio publico
        this.app.use(express.static('public'))
        // Cors(restricciones de endpoints)
        this.app.use(cors())
        // Lectura y Parseo del body
        this.app.use(express.json());
        //FileUpload - Carga de arhcivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
        // Sockets
        this.sockets();

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));


    }

    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;