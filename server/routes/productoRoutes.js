const express = require('express');
const {verificatoken} = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/productoModels');
// =====================
// Obtener o Listar Productos
// =====================
app.get('/productos',verificatoken,(requestGetProductos,responseGetProductos)=>{
    //trae todos los productos
    //populate: usuario categoria
    // paginado o sea sort

    let desde = requestGetProductos.query.desde || 0;
    let limite = requestGetProductos.query.limite || 5
    desde = Number(desde);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(Number(limite))
            .populate('clientes', 'nombre email')
            .populate('categoria','descripcion')
            .exec((errorAlListarProductos,productosAlistar)=>{
                if (errorAlListarProductos){
                    return responseGetProductos.status(500).json({
                        ok:false,
                        errorAlListarProductos
                    });
                };

                responseGetProductos.json({
                    ok:true,
                    productosAlistar
                });
            });


});

// =====================
// Obtener Productos por ID
// =====================
app.get('/productos/:id',verificatoken,(requestGetProductosporID,responseGetProductosporID)=>{
    //trae los productos por id
    //populate: usuario categoria
    // paginado o sea sort
    let id = requestGetProductosporID.params.id;
    Producto.findById(id) //al parecer de esta forma exige que en los params del postman especifique el nombre de cada parametro
            .populate('clientes','nombre email')
            .populate('categoria','nombreCategoria')
            //.sort('nombreProducto')
            .exec((errorGetProductoporID,productoEncontradoenBBDD)=>{
                if(errorGetProductoporID){
                    return responseGetProductosporID.status(500).json({
                        ok:false,
                        mensaje:'error en exec del findbyid del producto en get por id',
                        errorGetProductoporID
                    });
                };

                if(!productoEncontradoenBBDD){
                    return responseGetProductosporID.status(400).json({
                        ok:false,
                        mensaje:'producto no encontrado',
                        errorAlListarProductos
                    });
                };

                responseGetProductosporID.json({
                    ok:true,
                    productoEncontradoenBBDD
                })
            });
                
});
// =====================
// Buscar Productos por nombre o termino
// =====================
app.get('/productos/buscar/:termino',verificatoken,(requestBuscarProductoGet,responseBuscarProductoGet)=>{

    let termino = requestBuscarProductoGet.params.termino;
    let expresionRegular = new RegExp(termino,'i')

    Producto.find({nombreProducto:expresionRegular})
            .populate('categoria','nombreCategoria')
            .exec((errorExecuteGetBuscarProducto,productosBuscadosPorNombre)=>{
                if (errorExecuteGetBuscarProducto){
                    return responseBuscarProductoGet.status(500).json({
                        ok:false,
                        errorExecuteGetBuscarProducto
                    });
                };

                responseBuscarProductoGet.json({
                    ok:true,
                    productosBuscadosPorNombre
                })
            });
});
// =====================
// Crear Productos nuevos
// =====================
app.post('/productos',verificatoken,(requestPostProductos,responsePostProductos)=>{
    //grabar usuario
    //grabar categoria del listado

    //trae todos los productos
    //populate: usuario categoria
    // paginado o sea sort
    let body = requestPostProductos.body;
    let producto = new Producto({
        usuario: requestPostProductos._id,
        nombreProducto: body.nombreProducto,
        precioUnitario:body.precioUnitario,
        descripcionProducto:body.descripcionProducto,
        disponible:body.disponible,
        categoriaProductoID:body.categoriaProductoID
    });

    producto.save((errorSaveProducto,productoEnviadoaBBDD)=>{
        if(errorSaveProducto){
            return responsePostProductos.status(500).json({
                ok:false,
                errorSaveProducto
            });
        };

        responsePostProductos.status(201).json({
            ok:true,
            producto: productoEnviadoaBBDD
        });
    })



});

// =====================
// Actualizar Productos 
// =====================

app.put('/productos/:id',verificatoken,(requestPutProductos,responsePutProductos)=>{
    //grabar usuario
    //grabar categoria del listado
    let id = requestPutProductos.params.id;
    let body = requestPutProductos.body;
    
    Producto.findById(id,(errorEncontrarProductoEnPut,productoAActualizarenBBDD)=>{
        if(errorEncontrarProductoEnPut){
            return responsePutProductos.status(500).json({
                ok:false,
                mensaje:'error al intentar actualizar el producto',
                errorEncontrarProductoEnPut
            })
        };

        if(!productoAActualizarenBBDD){
            return responsePutProductos.status(400).json({
                ok:false,
                mensaje:'error al buscar el producto, no encontrado',
                errorEncontrarProductoEnPut
            });
        };

        productoAActualizarenBBDD.nombreProducto=body.nombreProducto;
        productoAActualizarenBBDD.precioUnitario=body.precioUnitario;
        productoAActualizarenBBDD.categoriaProductoID=body.categoriaProductoID;
        productoAActualizarenBBDD.descripcionProducto=body.descripcionProducto;
        productoAActualizarenBBDD.disponible=body.disponible;

        productoAActualizarenBBDD.save((errorAlSaveDeActualizarProducto,productoActualizadoenBBDD)=>{
            if(errorAlSaveDeActualizarProducto){
                return responsePutProductos.status(500).json({
                    ok:false,
                    errorAlSaveDeActualizarProducto
                });
            };

            responsePutProductos.status(200).json({
                ok:true,
                productoActualizadoenBBDD
            });

        })

        
    });



});


// =====================
// Borrar Productos pero en realidad solo le cambia en disponible a false
// =====================

app.delete('/productos/:id',verificatoken,(requestDeleteProductos,responseDeleteProductos)=>{
    let id = requestDeleteProductos.params.id;

    Producto.findById(id,(errorDelfindIdEnDelete,productoAactualizareliminado)=>{
        if(errorDelfindIdEnDelete){
            return responseDeleteProductos.status(500).json({
                ok:false,
                mensaje:'error en en find by id del delete',
                errorDelfindIdEnDelete
            });
        };
        if(!productoAactualizareliminado){
            return responseDeleteProductos.status(400).json({
                ok:false,
                mensaje:'no se encontro producto a eliminar',
                errorDelfindIdEnDelete
            });
        };

        productoAactualizareliminado.disponible = false;

        productoAactualizareliminado.save((errorProcesoActulizaciondelete,productoBorradoAnoDisponible)=>{
            if(errorProcesoActulizaciondelete){
                return responseDeleteProductos.status(500).json({
                    ok:false,
                    errorProcesoActulizaciondelete
                });
            };

            responseDeleteProductos.json({
                ok:true,
                mensaje:'producto borrado (en realidad cambiado a no disponible)',
                productoBorradoAnoDisponible
            })
        });
    });
});


module.exports=app;