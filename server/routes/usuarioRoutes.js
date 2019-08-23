const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuarioModels');
const app = express();


//operaciones CRUD (Create,Read,Update,Delete) (crear,leer,actualizar,borrar)
app.get('/usuario',  (req, res) =>{ //obtener informacion quizas crear o actualizar en bbdd
    //res.json('getUsuario LOCAL!!!')
    let desde = req.query.desde || 0 //recibe el numero inicio de los registros y si no hay nada usa el 0
    let limite = req.query.limite || 5
    //let llave=req.query.dato || null
    //let condicion=req.query.condicion || null
    let condicion_llaveValor_aCumplir={estado:true}
    Usuario.find(condicion_llaveValor_aCumplir,'nombre email role estado google img')//el primero {} es la condicion que debe cumplir, si tiene ese {llave:valor} y el segundo es el filtro de los llave:valor que quiero que aparezcan
            .skip(Number(desde)) //se tuvo que convertir el dato recogido y parseado (o cambiado) a numero
            .limit(Number(limite))
            .exec((errorGet,clientes)=>{
                if(errorGet){
                    res.status(400).json({
                        ok:false,
                        errorGet
                    })
                };

                /*Usuario.count(condicion_llaveValor_aCumplir,(errorGetCount,conteo)=>{//el count recibe una condicion para los registros
                    if(errorGetCount){
                        res.status(400).json({
                            ok:false,
                            errorGetCount
                        })
                    };

                    res.json({
                        ok:true,
                        usuarios,
                        cuantos_Usuarios_cumplen_condicion_true:conteo
                    }); 
                });*/
                Usuario.count({estado:false},(errorConteoFalses,conteosFalses)=>{
                    if(errorConteoFalses){
                        res.status(400).json({
                            ok:false,
                            errorConteoFalses
                        })
                    };
                    res.json({
                        okfalses:true,
                        clientes,
                        cuantos_Usuarios_cumplen_condicion_false:conteosFalses
                    });
                });

                
            })
  });
  
  app.post('/usuario',  (req, res)=> {// crear nuevos registros en bbdd
  
      let body =req.body;

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password,10),
          //img:body.img,
          role: body.role
          //estado:
          //google:
      })

      usuario.save((error, ususarioDB)=>{
          
        if(error){
              res.status(400).json({
                  ok:false,
                  error
              })
          }

        //ususarioDB.password = null; esta es una forma no recomendable de evitar que se vea la contraseña en la respuesta al usuario

        res.json({
              ok:true,
              clientes:ususarioDB
          });
      });
      
  
      /* if (body.nombre === undefined) {
          res.status(400).json({
              ok:false,
              explicacion : 'bad request',
              mensaje: 'el nombre es necesario'
          });
      } else {
          res.json({
              persona : body
          });
      }; */
  });
  
  app.put('/usuario/:id',  (req, res) => { //actualizar datos en bbdd, al igual que patch
      let idUsuario =req.params.id;
      let body = _.pick(req.body, ['nombre','email','img','role','estado']);
      //let usuario =res.nombre;

      /* Usuario.findById(idUsuario,(error,ususarioDB)=>{
        ususarioDB.save()
      }); */

      Usuario.findByIdAndUpdate(idUsuario,body,{new:true,runValidators:true},(error,usuarioDB)=>{
        if(error){
            res.status(400).json({
                ok:false,
                error
            })
        };

        res.json({
            ok:true,
            clientes:usuarioDB
        });

      });

      
  });
  
  /***********************************
   * ************ ESTE DELETE ES ELIMINADO PORQUE NO SE DEBE ELIMINAR EL REGISTRO DEFINITIVAMENTE
   * SE ACTIVA QUITANDO LOS COMENTARIOS O COPIANDO SOBRE ESTE COMENTARIO Y GRABANDO
  app.delete('/usuario/:id',  (req, res)=> { //borrar informacion en la bbdd
      //res.json('deleteUsuario')
      let idDelete = req.params.id;

      Usuario.findByIdAndRemove(idDelete,(errorDelete,usuarioBorrado)=>{
        if(errorDelete){
            res.status(400).json({
                ok:false,
                errorDelete
            })
        };

        if( usuarioBorrado === null ){
            return res.status(400).json({
                ok:true,
                error:{
                    errorDelete,
                    mensaje_Error_propio:'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })


      })

  });
  *************/

  app.delete('/usuario/:id',(req,res)=>{//cambia la info en bbdd para que sea estado:false y NO ELIMINA EL REGISTRO
        let idDeleteMejorado = req.params.id;
        let estado = {estado:false};

        Usuario.findByIdAndUpdate(idDeleteMejorado,estado,{new:true,runValidators:true},(errorDeleteMejorado,usuarioDBActualizadoAfalseState)=>{
            if(errorDeleteMejorado){
                res.status(400).json({
                    ok:false,
                    errorDeleteMejorado
                });
            };

            res.json({
                ok:true,
                usuarioDBActualizadoAfalseState
            });
        });
  });
  //module.exports={app}; no fnciona asi y no se por que....
module.exports=app;