var request = require('request'),
	cheerio = require('cheerio'),
	fs 		= require('fs')
	mongoose= require('mongoose');

	mongoose.connect('mongodb://localhost/links');

	var datosModel = mongoose.model('datos',{
		titulo: String,
		imagen: String
	});

request({url: 'http://thehackernews.com/', encoding: 'binary'}, function(err, resp, body){
	if(!err && resp.statusCode == 200){
		var $ = cheerio.load(body);
		var i = 0;
		$('.blog-posts .hnews').each(function(){
			var titulo = $(this).find('h1 a').html();
			var imagen = $(this).find('img').attr('src');

			var file = fs.createWriteStream('img/'+i+'.jpg');
			request(imagen).pipe(file);

			var datos = new datosModel({
				titulo: titulo,
				imagen: i+'.jpg'
			});

			datos.save(function(error){
				if(error){
					console.log(error);
				}
			})


			i = i+1;
		});

		console.log('Fin');
	}
});



