let TwitterController = function(req, res){

	let Twitter = require('twitter');
	let Config = require(process.cwd()+'/config.json');
	let twitterClient = new Twitter({
			consumer_key: Config.twitter.consumer_key,
			consumer_secret: Config.twitter.consumer_secret,
			access_token_key: Config.twitter.access_token_key,
			access_token_secret: Config.twitter.access_token_secret
		});
	// let AvailableLocation = require(process.cwd()+'/available.json');

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
		

		// lat:35.79449997305192,
		// 	long:139.79078800000002
		// name: 'Winnipeg',
  //   placeType: { code: 7, name: 'Town' },
  //   url: 'http://where.yahooapis.com/v1/place/2972',
  //   parentid: 23424775,
  //   country: 'Canada',
  //   woeid: 2972,
  //   countryCode: 'CA'
		//https://api.twitter.com/1.1/trends/closest.json?lat=35.79449997305192&long=139.79078800000002
		// let requestUrl = '/trends/available.json';
		// let requestUrl = '/trends/closest.json';
		// let params = {
		// 	q: 'bboy' 
		// };
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

	let handleKeywords = function(rawKeywords){
		let ret = [];
		for (var i = 0; i < rawKeywords.length; i++) {
			ret.push(rawKeywords[i].name);
		}
		return ret;
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
