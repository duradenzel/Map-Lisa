const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.listen(3000, () => console.log(' Visit 127.0.0.1:3000'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bmvmap"
})

con.connect();

app.get("/api", (req,res) =>{
    
   // console.log(req);
    con.query("SELECT * FROM cards", function(err, result){
        if (err) throw err;
        else{
            res.send(result);
        }
    });
});

app.post('/createpost', function(req, res){
    var sql = "INSERT INTO cards (cardNaam, cardNr, cardOpdrachtgever, cardArchitect, cardSegment, cardJaar, cardOmzet, lng, lat, cardImage, cardCoords) VALUES (?)";
    var data = req.body;
    console.log(data);
    var values = [data.cdNaam, data.cdNr, data.cdOpdrachtgever, data.cdArchitect, data.cdSegment, data.cdJaar, data.cdOmzet, data.cdLng, data.cdLat, data.cdImg, JSON.stringify(data.cdCoords)];
    con.query(sql , [values] , function(err, result){
        if(err) throw err;
            console.log("record inserted");
        });
        res.redirect('back');
    res.end();
});

app.put("/update", (req,res) =>{
    var data = req.body;
    var sql = `UPDATE cards
    SET cardNaam = ?,
    cardNr = ?,
    cardOpdrachtgever = ?,
    cardArchitect = ?,
    cardSegment = ?,
    cardJaar = ?,
    cardOmzet = ?
    WHERE cardId = ?`;
    con.query(sql, data, (error, results, fields) => {
      if (error){
        return console.error(error.message);
      }
  
      console.log('Rows affected:', results.affectedRows);
      res.send('success!!');
      
    });
    
     
   });

   app.delete('/delete', function (req, res) {
    con.query('DELETE FROM `cards` WHERE `cardId`=?', [req.body.cardId], function (error, results, fields) {
       if (error) throw error;
       res.redirect('back');
       res.end('Record has been deleted!');
      
     });
 });


 app.get("/getimages/:id", (req,res) =>{
    // console.log(req);
     con.query("SELECT * FROM images WHERE `imageId` = ?",[req.params.id], function(err, result){
         if (err) throw err;
         else{
             res.send(result);
         }
     });
 });
     

 
     
  

