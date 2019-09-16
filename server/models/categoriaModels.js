const mongoose = require('mongoose')
//const validadorUnico = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombreCategoria:{
        type:String,
        unique:true, //esto hace que no se pueda repetir ni crear otro con este valor
        required:[true,'el nombre de la categoria es necesaria']
    },
    descripcionCategoria:{
        type:String,
        required:false,
        default:'descripcion no especificada'
    },
    estadoCategoria:{
        type:Boolean,
        required:false,
        default:true
    }

});

//categoriaSchema.plugin(validadorUnico,{mensaje:'{PATH} no puede repetirse'})--->al final lo quite para que lo vea por duplicado en unique


module.exports=mongoose.model('categorias',categoriaSchema); //aqui es donde se da el nombre de la tabla en la BBDD y el segundo parametro es la clase que provoca el objeto