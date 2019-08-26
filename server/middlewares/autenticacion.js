const jwt = require('jsonwebtoken');

// ================
// verificar token
//=================
let verificatoken = ( req,res,next ) => { // si no usa el next no sigue correndo lo demas el rograma

    let token =req.get('token'); //antes usaba req.body pero era para llaar a todo el boy, ahora solo busco el token

    /* res.json({
        token
    }) */

    jwt.verify(token,process.env.SEED,(errorVerifyToken,decodificado)=>{
        
        if(errorVerifyToken){
            return res.status(401).json({
                ok:false,
                mensaje:'el token no es valido',
                errorVerifyToken
            })
        };

        req.cliente =decodificado.cliente;
        next();
    });



};

let verificaAdmin_Role = (req,res,next) =>{
    let cliente= req.body.role;

    if(cliente==='ADMIN_ROLE'){
        next();
    }else{
        return res.status(400).json({
            ok:false,
            mensaje_de_error:'el usurio no puede hacer cambios porque no es administrador'
        });
    };


}

module.exports={
    verificatoken,
    verificaAdmin_Role
}