const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es uno de los roles válidos'
}

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true,'el nombre es necesario y obligatorio']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'el email es necesario y obligatorio']
    },
    password:{
        type:String,
        required:[true,'el password o contraseña es necesario y obligatorio']
    },
    img:{
        type:String,
        required:false //esta linea es opcional
    },
    role:{
        type:String, 
        enum: rolesValidos,
        //required:true, (no se uso, lo hice mal)
        default:'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

usuarioSchema.methods.toJSON = function(){ //no se debe usar funcion de flecha porque necesitamos el this
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser único'});

module.exports = mongoose.model('clientes',usuarioSchema); //el primer parametro es el nombre de la tabla donde se guarda el registro