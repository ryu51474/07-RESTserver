const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

    
});


//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    /* console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture); */
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
    //const userid = payload['sub']; esto no interesa
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
  }
  //verify().catch(console.error);no se va a necesitar aqui


app.post('/google',async(req,res)=>{
    let token = req.body.idtoken
    let googleuser=await verify(token).catch(errordeloginGoogle=>{
                                            return res.status(403).json({
                                                ok:false,
                                                errordeloginGoogle
                                            });
                                        });
    /* res.json({
        cliente:googleuser
    }); */

    Usuario.findOne({email:googleuser.email},(errorDefindOneUsuarioPostDequeNOexiste,cliente)=>{
        if(errorDefindOneUsuarioPostDequeNOexiste){
            return res.status(500).json({
                ok:false,
                errorDefindOneUsuarioPostDequeNOexiste
            });
        };

        if(cliente){ //cliente que se autentico normal sin google
            if(cliente.google===false){
                return res.status(400).json({
                    ok:false,
                    errordiferente:{
                        mensajedelerrorDiferente:'debe usar sua autenticación normal'
                    }
                });
            }else{//cliente se autentica por google
                let token = jwt.sign({
                    cliente
                }, process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    cliente,
                    token
                })
            }
        }else{//si el usuario no se ha autenticado por niguna via anterior es su primera vez o sea no existia en nuestar bbdd
            let cliente=new Usuario();

            cliente.nombre=googleuser.nombre;
            cliente.email=googleuser.email;
            cliente.img=googleuser.picture;
            cliente.google=true;
            cliente.password=':)';

            cliente.save((errorDeSAveDelPostGoogle,cliente)=>{
                if(errorDeSAveDelPostGoogle){
                    return res.status(400).json({
                        ok:false,
                        errorDeSAveDelPostGoogle
                    })
                };

                let token = jwt.sign({
                    cliente
                }, process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    cliente,
                    token
                })
            })

        }

    })

});







module.exports=app;