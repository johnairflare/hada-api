let TwitterController = function(req, res){

	let Twitter = require('twitter');
	let TwitterConfig = {
			consumer_key: process.env.consumer_key,
			consumer_secret: process.env.consumer_secret,
			access_token_key: process.env.access_token_key,
			access_token_secret: process.env.access_token_secret
		};

	if (!process.env.consumer_key || 
		!process.env.consumer_secret || 
		!process.env.access_token_key || 
		!process.env.access_token_secret ) {
		TwitterConfig = require(process.cwd()+'/config.json').twitter
	}

	let twitterClient = new Twitter(TwitterConfig);

	let getAvailableWoeid = function(lat, long, callback){
		let params = {
			lat: lat,
			long: long
		};

		let requestUrl = '/trends/closest.json';

		twitterClient.get(requestUrl, params, function(error, location, response) {
			let contents = [];
			if (!error) {
				try{
					callback(null, location[0]);
				}catch(e){
					callback(e, null);
				}
			}else{
				callback(JSON.stringify(error), null);
			}
		});
	}

	let getKeywords = function(location, callback){

		let params = {
			id:location.woeid
		};
		
		let requestUrl = '/trends/place.json';

		twitterClient.get(requestUrl, params, function(error, tweets, response) {
			let contents = [];
			if (!error) {
				try{
					callback(null, tweets);
				}catch(e){
					callback(e, null);
				}
			}else{
				callback(JSON.stringify(error), null);
			}
		});
	}

	let handleKeywords = function(keywords, location){
		let ret = [];
		let totalPoint = 0;
		for (var i = 0; i < keywords.length; i++) {
			var word = keywords[i].name.replace('#','');
			var point = keywords[i].tweet_volume || 0;
			totalPoint += keywords[i].tweet_volume;
			ret.push({word:word, point:point});	
		}

		return {
			topics:ret.sort(function(a, b){return b.point-a.point}),
			location:location,
			totalPoint:totalPoint
		};
	}

	let initData = function(){

		getAvailableWoeid(req.params.lat, req.params.long, function(err, location){
			if (err) {
				res.send(err);	
			}else{
				getKeywords(location, function(err, result){
					if (err) {
						res.send(err);	
					}else{
						let ret = handleKeywords(result[0].trends, result[0].locations[0].name);
						res.send(ret);
					}
				});
			}
		});
	}

	initData();
};

module.exports = TwitterController;
