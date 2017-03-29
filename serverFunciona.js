console.log("Inicio");

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = 'mongodb://leandro:leandro@ds141410.mlab.com:41410/db_leandro';

var db;
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, (err, database) => {
    
    // if (err) return console.log(err);
    if(err) throw err;//throw vai parar a execução e exibir o erro no console 	

    db = database
    
    app.listen(3000, () => {
        console.log('Porta 3000 OK');
    });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/quotes', (req, res) => {

	///como o objeto tem o mesmo nome seria possível passar 
	//req.body mas em "teoria" tem de haver uma validação dos dados antes 
    var data = {
        name: req.body.Name,
        quote: req.body.Quote
    };

    db.collection('quotes').insertOne(data, function(err, result) {

        /// não esquecer de tratar um possível erro 
        if (err) {
            throw err; //Throw vai parar a execução e mostrar o erro no console 
        }

        console.log("Inserted a document into the restaurants collection.");
        res.redirect('/');

    });
});