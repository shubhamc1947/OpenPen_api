import mysql from 'mysql2';
import dotevn from 'dotenv';



dotevn.config();


// const urlDB=`mysql://root:xupHqcDNCHNPdbnzEDUHkPAJpWoPDfLq@monorail.proxy.rlwy.net:33554/railway`;
// var con=mysql.createConnection(urlDB);

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database:"blog"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  export default con;