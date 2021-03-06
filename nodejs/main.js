var https = require('https');
var spark_api_options = {
  hostname: 'api.spark.io',
  method: 'POST',
  path: '/v1/devices/' + process.env.twittertorch_deviceid + '/message',
  headers: {
    'Authorization': 'Bearer ' + process.env.twittertorch_sparktoken,
    'Content-Type': 'application/json'
  }
};
var Twit = require('twit');
var twitter = new Twit({
  consumer_key:         process.env.twittertorch_consumerkey,
  consumer_secret:      process.env.twittertorch_consumersecret,
  access_token:         process.env.twittertorch_twittertoken,
  access_token_secret:  process.env.twittertorch_twittertokensecret
});
var stream = twitter.stream('statuses/filter', { track: '@sparkdevices #makerfaire' });
stream.on('tweet', function(tweet){
  console.log('TWEET: ' + tweet.text);
  var t = tweet.text.replace(/#/g, ''); ///[^a-z0-9 ]/gi, '');
  console.log('STRIPPED: ' + t);

  var req = https.request(spark_api_options, function(res){
    console.log('SPARK: status ' + res.statusCode);
    res.on('data', function(d){
      console.log('SPARK: ' + d);
    });
  });
  req.write(JSON.stringify({t:t}));
  req.end();
  req.on('error', function(e){
    console.error('SPARK: error ' + e);
  });
});
