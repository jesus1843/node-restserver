//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3000;


//====================
// Entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================
// Base de Datos
//====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb://jjesus:Jj12243648@ds259079.mlab.com:59079/restserver-curso-node';
}

process.env.URLDB = urlDB;