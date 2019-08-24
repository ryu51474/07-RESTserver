require('./config/config')
//require('./routes/usuario')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//const puerto =process.env.PORT || 3000;

//middlewares

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }));
        
        // parse application/json
        app.use(bodyParser.json());

        //importamos rutas de usuarios.js
        //app.use((req,res)=>{require('./routes/usuario')}); 
        //se uso arriba funcion de flecha pues daba error de middleware que espera una funcion
        //app.use( require('./routes/usuarioRoutes') );
        //ahora se ncluye una linea parecida para activar el login
        //app.use( require( './routes/loginRoutes' ) );
        //finalmente esto de hacerlo archivo por archivo no es recomendable ppor lo que se hara un require general en index.js
        //ESTA ES LA CONFIGURACION GLOBAL DE RUTAS
        app.use(require('./routes/index'));

/****************
mongoose.connect('mongodb://localhost:27017/cafeDemo',
                { useNewUrlParser:true, useCreateIndex:true, useFindAndModify:false }, //actualizaciones al curso porque esta parte corrige lo deprecado
                (error)=>{

if(error) throw `No se pudo conectar a la base de datos por el error: ${error}`;

console.log(`Base de Datos CORRIENDO`)

});
**************/

mongoose.connect(process.env.URL_de_la_BBDD,
                { useNewUrlParser:true, useCreateIndex:true , useFindAndModify:false }, //actualizaciones al curso porque esta parte corrige lo deprecado
                (error)=>{

if(error) throw `No se pudo conectar a la base de datos por el error: ${error}`;

console.log(`Base de Datos CORRIENDO`)

});


app.listen(process.env.PORT, ()=>{
    console.log(`Esta corriendo ya el servidor en el puerto:  ${process.env.PORT}`);
});