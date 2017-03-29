// main.js

var update = document.getElementById('update')
var del =document.getElementById('delete')

update.addEventListener('click', function(){
	fetch('quotes',{
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'name': 'Anonimous',
			'quote': 'H4CK34D0 0T4R10'
		})
	}).then(res =>{
		if(res.ok) return res.json()
	}).then(data =>{
		console.log(data)
		window.location.reload()
	})
})



del.addEventListener('click',function(){
	fetch('quotes',{
		method: 'delete',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'name':'Anonimous'
		})

	//})//.then(res =>{
		//if(res.ok) return res.json()
	}).then(data =>{
		console.log(data)
		window.location.reload()
	})
})

