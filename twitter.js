var http = require("http");
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

//create redis client                                                                                                                                                                                                                       
var client = redis.createClient();

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.match(/awesome/)) {
                client.incr('awesome');
            }
            
            if(tweet.text.indexOf("cool") > -1) {
              client.incr("cool");
            }
        });
    }
);

var server = http.createServer(function (req, res) {
    client.mget(["awesome","cool"], function(err, results) {
        if (err !== null) {
            //handle error here
            console.log("error: " + err);
        } else {
  	    var response = "<b>Hello from my http server!!</b>";
	    response += "<p>Total awesome: " + results[0] + "</p>";
	    response += "<p>Total cool: " + results[1] + "</p>";
	    res.writeHead(200, {"Content-Type": "text/html"});
	    res.end(response);
        }
    });
}).listen(3000);