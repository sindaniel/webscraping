var request 	= require('request'),
	cheerio 	= require('cheerio'),
	mongoose 	= require('mongoose'),
	fs 			= require('fs'),	
	S			= require('string'),
	urls2 		= [];

mongoose.connect('mongodb://localhost/computrabajo');
var Urls = mongoose.model('Urls', { url: String });

var Jobs = mongoose.model('Jobs', { 
	company: 	String,
	name_job: 	String,
	description:String,
	date: 		String,
	locate: 	String,
	region:     String,
	wage:  		String,
	beginning:  String,
	duration:   String,
	type_job:   String,
	send_to:    String,
	contact:    String,
	phone:      String,
	fax: 	    String,
	email: 		String
});




Urls.find( function (err, urls) {
	 
	 urls.forEach(function(user) {
	    //console.log('http://www.computrabajo.com.co'+user.url);
		request({url: 'http://www.computrabajo.com.co/'+user.url,encoding: 'binary'}, function(err, resp, body){
		//console.log(resp.statusCode.toString() + " " +'http://www.computrabajo.com.co/'+user.url);
			if(!err && resp.statusCode.toString() == '200'){
				var $ = cheerio.load(body);
				var imagen;
				var dataSite = [];
				imagen =  $('html>body>center>table>tr>td>table>tr>td>table>tr>td>table img').attr('src');
				
				$('html>body>center>table>tr>td>table>tr>td>table>tr>td>table>tr').each(function(){
					
					$($(this).find('td')).each(function(){
						var data = S(this.html()).stripTags('font', 'b', 'p', 'span').s;
						
						dataSite.push(data.toString());
					});	

				});
				console.log(dataSite);
				
				
				if(dataSite[3] === undefined){
					dataSite[3] = 'hola';
				}
				var img  = S(dataSite[3]).slugify().s;
				var ws = fs.createWriteStream('images/'+img+'.gif');
			   	ws.on('error', function(err) { console.log(err); });
			   	request('http://www.computrabajo.com.co/'+imagen).pipe(ws);



				//console.log(dataSite[5]);
				var newJob = new Jobs({ 
						company: 	dataSite[1],
						name_job: 	dataSite[3],
						description:dataSite[5],
						date: 		dataSite[8],
						locate: 	dataSite[10],
						region:     dataSite[12],
						wage:  		dataSite[14],
						beginning:  dataSite[16],
						duration:   dataSite[18],
						type_job:   dataSite[20],
						send_to:    dataSite[22],
						contact:    dataSite[26],
						phone:      dataSite[28],
						fax: 	    dataSite[30],
						email: 	imagen
				});
				newJob.save(function (err) {if (err) {console.log('meow');} });

			}
		});

	});	 
});



// var pag = 1;
// for (var i = 1; i <= 500; i++) {
	
// 	request('http://www.computrabajo.com.co/bt-ofr-ST002-'+pag+'.htm', function(err, resp, body){
// 	console.log(resp.statusCode+" "+'http://www.computrabajo.com.co/bt-ofr-ST002-'+pag+'.htm');
// 	if(!err && resp.statusCode == 200){
// 		var $ = cheerio.load(body);
// 		$('a').each(function(){
// 			var url = this.attr('href');
// 			if(url.indexOf('bt-ofrd-') != -1){
// 				console.log(url);
// 				var kitty = new Urls({ url: url });
// 				kitty.save(function (err) {if (err) {console.log('meow');} });
// 			}
// 		});	
// 	}
// 	});
// 	pag = pag + 20;


//  };



// request({url: 'http://www.computrabajo.com.co/bt-ofrd-contactamos0911-2258768.htm',encoding: 'binary'}, function(err, resp, body){
// 	if(!err && resp.statusCode == 200){
// 		var $ = cheerio.load(body);
// 		$('html>body>center>table>tr>td>table>tr>td>table>tr>td>table>tr').each(function(){
// 			$($(this).find('td')).each(function(){
				
// 				urls.push( S(this.html()).stripTags().s  );
			
// 			});	
// 		});
// 		console.log(urls);		
// 	}
// });