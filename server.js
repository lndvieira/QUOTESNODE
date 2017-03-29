console.log("Inicio");

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = 'mongodb://leandro:leandro@ds141410.mlab.com:41410/db_leandro';

var db;
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url,(err, database)=>{

	if(err) throw err;//throw vai parar a execução e exibir o erro no console 	

	db = database
	
	app.listen(3000, ()=>{
		console.log('Porta 3000 OK')
	})
	
})

//------------PATH e CALLBACK-----------------
//app.get(path, callback);
/*
PATH=The first argument, path, is the path of the GET request. It’s anything that comes after your domain name.
When we’re visiting localhost:3000, our browsers are actually looking for localhost:3000/. The path argument in this case is /.
CALLBACK=The second argument is a callback function that tells the server what to do when the path is matched. It takes in two arguments, a request object and a response object:
*/
//-------------Metodo READ (CRUD)-------------
/*app.get('/',function(request, response	){
		res.send('Hello World')
	}
)
------------Versão desse codigo em ES6--------
app.get('/', (req,res) =>{
		res.send('Hello World')
	}
)
*/
// Note: request and response are usually written as req and res respectively.

//------> Utilizar o bodyParser antes dos cruds!!!!! <-----
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()) //usado para que o servidor leia json
app.use(express.static('public'))// para dizer que a pasta public é publica
app.set('view engine','ejs')
// Agora vem os "handlers"


//-------------Metodo READ (CRUD)-------------
/*app.get('/', (req,res)=>{
	res.sendFile(__dirname + '/index.html');
})*/

app.get('/', (req,res)=>{

	db.collection('quotes').find().toArray((err,result)=> {
		
		if(err) throw err;

		//renderizar o index.ejs

		res.render('index.ejs', {quotes: result});
	});
})

//-------------Metodo CREATE (CRUD)-------------

app.post('/quotes',(req,res)=>{

	var data = {
		name: req.body.Name, 
		quote: req.body.Quote};
	
	db.collection('quotes').insertOne(data,(err,result)=>{
			
			if(err) throw err;
			
			console.log('Inserted to database');

			res.redirect('/');
	})
	
})

//------------Metodo UPDATE -------------------

app.put('/quotes', (req,res)=>{
	db.collection('quotes').findOneAndUpdate(
			//QUERY: utilizado para filtrar de acordo com o valor passado
			{ name: 'lele'},
			//UPDATE: diz o que fazer com o update request
			{
				$set: { //operador do mongodb
					name: req.body.Name,
					quote:req.body.Quote
				}
			},
			//OPTIONS: definir coisas adicionais
			{
				sort: {_id: -1}, //nesse caso pega o mais recente
				upsert: true //pode ser que não exista ninguem com o nome solicitado
			},
			//CALLBACK: permite ao mongo fazer algo depois que ele trocar o nome
			(err, result)=>{
				if(err) throw res.send(err)
				res.send(result)
				}
			
		)
})

//----------------Metodo DELETE------------

app.delete('/quotes', (req,res)=>{
	db.collection('quotes').findOneAndDelete(
		//QUERY
		{ name: req.body.Name},
		//CALLBACK
		(err,result)=>{
				if(err) throw res.send(500, err)
					res.send('Apagado')

			}
		
	)
})

