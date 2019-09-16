const express = require('express');
const _ = require('underscore');


let { verificatoken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoriaModels');

//==========================================================
//Mostrar todas las categorias
//==========================================================
app.get('/categoria',verificatoken,(requestCategoria,responseCategoria)=>{
    Categoria.find({})
            .sort('nombreCategoria')
            .populate('usuario','nombre email')
            .exec((errorCategoriaenGet,categorias)=>{
                if(errorCategoriaenGet){
                    return responseCategoria.status(500).json({
                        ok:false,
                        errorCategoriaPorIDenGet: errorCategoriaenGet
                    });
                };

                responseCategoria.json({
                    ok:true,
                    categorias
                });
            });
});

//==========================================================
//Mostrar una categoria por ID
//==========================================================
app.get('/categoria/:id',verificatoken,(requestCategoriaporID,responseCategoriaporID)=>{
    //Categoria.findById()

    let id = requestCategoriaporID.params.id;

    Categoria.findById(id,(errorCategoriaPorIDenGet,categoriaResultanteEnBBDD)=>{
        if(errorCategoriaPorIDenGet){
            return responseCategoriaporID.status(500).json({
                ok:false,
                errorCategoriaPorIDenGet
            });
        };

        if(!categoriaResultanteEnBBDD){
            return responseCategoriaporID.status(404).json({
                ok:false,
                error:'el Id no es correcto o valido',
                errorCategoriaPorIDenGet
            });
        };

        responseCategoriaporID.json({
            ok:true,
            categoria: categoriaResultanteEnBBDD
        });
        

    });
            
});

//==========================================================
//Crear nueva categorias (se empieza por aqui porque primero se crean)
//==========================================================
app.post('/categoria',verificatoken,(requestCategoria,responseCategoria)=>{
    //regresa la nueva categoria
    let cuerpoRequest=requestCategoria.body;
    //let clienteEjecutor=cuerpoRequest.email;

    let categoriaAcrear = new Categoria({
        nombreCategoria:cuerpoRequest.nombreCategoria,
        estadoCategoria:cuerpoRequest.estadoCategoria,
        descripcionCategoria:cuerpoRequest.descripcionCategoria,
    });

    categoriaAcrear.save((errorCreacionCategoria,categoriaParaEnviarALaBBDD)=>{
        if(errorCreacionCategoria){
            return responseCategoria.status(500).json({
                ok:false,
                errorCreacionCategoria
            });
        };

        if(!categoriaParaEnviarALaBBDD){
            return responseCategoria.status(400).json({
                ok:false,
                errorCreacionCategoria
            });
        };

        responseCategoria.json({
            ok:true,
            categorias:categoriaParaEnviarALaBBDD
        })

    });

    //req.usuario._id
});

//==========================================================
//Actualizar las categorias (segundo paso de las creaciones de los cruds)
//==========================================================
app.put('/categoria/:id',verificatoken,(requestCategoria,responseCategoria)=>{
    let idCategoriaEnParams = requestCategoria.params.id;
    let cuerpoRequestParaActualizarObtenidoDeLaPeticion = requestCategoria.body//_.pick(requestCategoria.body,['nombreCategoria','estadoCategoria']);

    Categoria.findByIdAndUpdate(idCategoriaEnParams,cuerpoRequestParaActualizarObtenidoDeLaPeticion,{ new: true, runValidators:true},(errorActualizacionCategoria,categoriaParaActualizar)=>{
        if (errorActualizacionCategoria){
            return responseCategoria.status(500).json({
                ok:false,
                errorActualizacionCategoria
            });
        };

        if (!categoriaParaActualizar){
            return responseCategoria.status(500).json({
                ok:false,
                errorActualizacionCategoria
            });
        };

        responseCategoria.json({
            ok:true,
            categorias:categoriaParaActualizar
        })

    });
});

//==========================================================
//borrado de las categorias (tercera parte de creacion de crud)
//==========================================================

app.delete('/categoria/:id',[verificatoken,verificaAdmin_Role],(requestCategoria,responseCategoria)=>{
    //solo un admin puede eliminar y que se elimine definitivamente
    let idCategoriaEnParamsParaBorrar = requestCategoria.params.id
    
    //Categoria.findByIdAndRemove
    Categoria.findByIdAndRemove(idCategoriaEnParamsParaBorrar,(errorBorradoDefinitivoCategoria,CategoriaBorrada)=>{
        if(errorBorradoDefinitivoCategoria){
            return responseCategoria.status(500).json({
                ok:false,
                errorBorradoDefinitivoCategoria
            });
        };

        if(CategoriaBorrada===null){
            return responseCategoria.status(400).json({
                ok:false,
                errorBorradoDefinitivoCategoria:'no se encuentra la categoria para borrar'
            });
        };

        responseCategoria.json({
            ok:true,
            categoria:CategoriaBorrada
        });
    });
});



module.exports = app;