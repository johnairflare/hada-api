let TwitterController = function(req, res){

	let Twitter = require('twitter');
	let Config = require(process.cwd()+'/config.json');
	let twitterClient = new Twitter({
			consumer_key: Config.twitter.consumer_key,
			consumer_secret: Config.twitter.consumer_secret,
			access_token_key: Config.twitter.access_token_key,
			access_token_secret: Config.twitter.access_token_secret
		});

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

	let handleKeywords = function(keywords){
		let ret = [];
		let retSequence = [];
		let pivot = 0;
		let noRanking = [];
		for (var i = 0; i < keywords.length; i++) {
			var word = keywords[i].name.replace('#','');
			if (keywords[i].tweet_volume === null) {
				noRanking.push({word:word, point:0});	
			}else{
				var isAdded = false;

				for (let j = pivot; j < retSequence.length; j++) {
					
					if (keywords[i].tweet_volume <= retSequence[j].tweet_volume) {
						console.log('add');
						// pivot = j;
						isAdded = true;
						ret.splice(ret.length - j, 0, {word:word, point:keywords[i].tweet_volume});
						retSequence.splice(j, 0, keywords[i]);
						break;
					}
				}

				if (isAdded === false) {
					retSequence.push(keywords[i]);
					ret.splice(retSequence.length - 1, 0, {word:word, point:keywords[i].tweet_volume});
				}
			}
		}
		
		return ret.concat(noRanking);
	}

	let initData = function(){

		getAvailableWoeid(req.params.lat, req.params.long, function(err, location){
			if (err) {
				res.send(err);	
			}else{
				getKeywords(location, function(err, result){
					let keywords = handleKeywords(result[0].trends);

					let ret = {
						keywords:keywords,
						location:result[0].locations[0].name
					};

					if (err) {
						res.send(err);	
					}else{
						res.send(ret);
					}
				});
			}
		});
	}

	initData();
};

module.exports = TwitterController;
