var request = require('request'),
    cheerio = require('cheerio');

	request({url: 'http://thehackernews.com/', encoding: 'binary'}, function(err, resp, body){
		if(!err && resp.statusCode == 200){
			var $ = cheerio.load(body);
			$('.blog-posts .hnews h1 a').each(function(){
				var titulo = $(this).html();
				console.log(titulo);
			});

		}
	});
