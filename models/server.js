const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        // Conectar a BD
        this.database();
        // Middlewares
        this.middlewares();
        // Rutas de mi App
        this.routes();
    }

    async database(){
        await dbConnection();
    }

    middlewares() {
        
        // Directorio publico
        this.app.use(express.static('public'))
        // Cors(restricciones de endpoints)
        this.app.use(cors())
        // Lectura y Parseo del body
        this.app.use(express.json());

    }

    routes() {

        this.app.use( this.authPath, require('../routes/auth') );
        this.app.use( this.usuariosPath, require('../routes/usuarios') );

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;