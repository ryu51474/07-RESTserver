
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
//Base de Datos
//=====================

let urlDataBase;

if(process.env.NODE_ENV==='dev'){
        //LOCAL
        urlDataBase='mongodb://localhost:27017/cafeDemo';
}else{
        //NUBE
        urlDataBase=process.env.MONGODB_ATLAS_URLACCESS;
}

process.env.URL_de_la_BBDD = urlDataBase;
