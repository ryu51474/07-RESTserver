const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModels');
const app = express();

app.post('/login',(req,res)=>{

    let body = req.body;

    Usuario.findOne({email:body.email},(errorLoginUsuarioEmail,clienteDB)=>{

        if(errorLoginUsuarioEmail){
            return res.status(500).json({
                ok:false,
                errorLoginUsuarioEmail
            })
        };

        if (!clienteDB){
            return res.status(400).json({
                ok:false,
                errorLoginUsuarioEmail:{
                    mensajeDelError:'el email del usuario/cliente (fue el cliente) o contraseña (ya no usamos usuario) no existe en BBDD (no hay tu weá)'
                }
            })
        };

        if(!bcrypt.compareSync( body.password, clienteDB.password )){
            return res.status(400).json({
                ok:false,
                errorLoginUsuarioEmail:{
                    mensajeDelError:'el email del usuario/cliente o contraseña (fue la contraseña) no existe en BBDD (no hay tu weá)'
                }
            })
        }

        /*let token = jwt.sign({
            cliente:clienteDB
        },'este-es-el-SEED-desarrollo',{expiresIn:60*60*24*30}); CAMBIADO*/

        let token = jwt.sign({
            cliente:clienteDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            cliente:clienteDB,
            token
        });


    });

    
})








module.exports=app;