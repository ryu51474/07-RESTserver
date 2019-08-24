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
                errorVerifyToken
            })
        };

        req.cliente =decodificado.cliente;
        next();
    });



};



module.exports={
    verificatoken
}