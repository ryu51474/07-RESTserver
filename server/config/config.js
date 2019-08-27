//AQUI SE CONFIGURA TODAS LAS CONSTANTES DE CONFIGURACION DE SERVICIO
//=====================
//Puerto
//esto configura el puerto de escucha, 
//que puede que sea el que me de Heroku (para PRODUCCION) o el 3000 por defecto (para DESARROLLO)
//=====================
process.env.PORT = process.env.PORT || 3000;


//=====================
//ENTORNO
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//Vencimienot del token
//60 segundos *
//60 minutos *
//24 horas *
//30 dias
//=====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=====================
//SEED o semilla de autenticacion
//=====================

process.env.SEED=process.env.SEED||'este-es-el-SEED-desarrollo';

//=====================
//Base de Datos
//=====================

let urlDataBase;

if(process.env.NODE_ENV==='dev'){
        //LOCAL
        urlDataBase='mongodb://localhost:27017/cafeDemo';
}else{
        //NUBE
        urlDataBase=process.env.MONGODB_ATLAS_URLACCESS;
};

//=====================
//Google CLIENT_ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1036994765417-tgjki8bjttfgstrndno93j4v549ie2gv.apps.googleusercontent.com';

process.env.URL_de_la_BBDD = urlDataBase;
