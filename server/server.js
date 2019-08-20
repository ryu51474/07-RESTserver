require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const puerto =process.env.PORT || 3000;

//middlewares

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }));
        
        // parse application/json
        app.use(bodyParser.json());

 

//operaciones CRUD (Create,Read,Update,Delete) (crear,leer,actualizar,borrar)
app.get('/usuario', function (req, res) { //obtener informacion quizas crear o actualizar en bbdd
  res.json('getUsuario')
});

app.post('/usuario', function (req, res) {// crear nuevos registros en bbdd

    let body =req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok:false,
            explicacion : 'bad request',
            mensaje: 'el nombre es necesario'
        });
    } else {
        res.json({
            persona : body
        });
    };
});

app.put('/usuario/:id', function (req, res) { //actualizar datos en bbdd, al igual que patch
    let idUsuario =req.params.id;
    res.json({
        idUsuario
    })
});

app.delete('/usuario', function (req, res) { //borrar informacion en la bbdd
    res.json('deleteUsuario')
});
 
app.listen(process.env.PORT, ()=>{
    console.log(`Esta corriendo ya el servidor en el puerto: ${puerto}`,process.env.PORT);
});