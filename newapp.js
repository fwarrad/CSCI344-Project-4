var $ = window.$;
var ctwitter = window.ctwitter; 
var console = window.console; 
"use strict";
// create list of modules required
var express = require("express"),
    http = require("http"),
    path = require("path"),
    twitter = require('ntwitter'),
    credentials = require("./credentials.js"),
    redisClient = require("redis").createClient(),
    app = express();
//This app combines the previous twitter.js and app.js files into one app. 

//twitter.js portion of the app starts here:       
// create link to get secure credentials
var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});
// start ntwitter and tracked words
// these are the only lines you should have to change for either sad or happy words
var happyWords = ["easier", "interesting", "honest", "pal", "warmth", "rest", "safe"];
var sadWords = ["anguished", "tormented", "heartbroken", "bitter", "tearful", "grieving", "ignorant", "sad"];
var trackedWords = happyWords.concat(sadWords);
console.log(trackedWords);
for (var i = 0; i< trackedWords.length; i++) {  redisClient.set(trackedWords[i], 0)   }
// start twitter
t.stream(
    "statuses/filter",
        {track: trackedWords, lang: "en" },
    function(stream) {
        stream.on('data', function(tweet) {
            for (var i= 0; i < trackedWords.length; i++) {
                if(tweet.text.indexOf(trackedWords[i]) > - 1) {
                    // incriments added value to the word
                    redisClient.incr(trackedWords[i]);
                    console.log(trackedWords[i]);
                }
            }
        }); 
    }
);

//app.js portion of the app starts here:
// This is our basic configuration        
app.configure (function () {
        // Define our static file directory, it will be 'public'   
        app.use(express.static(path.join(__dirname, 'public')));
});
// Create the http server and get it to                                                                                                                
// listen on the specified port 3000    
http.createServer(app).listen(3000, function () {
    console.log("twitterApp server listening on port 3000");
});
// retreives the current count for each word
app.get("/counts.json", function (req, res) {
    redisClient.mget(trackedWords, function (error, count) {
        if (error !== null) {
            // this will handle the error and will print it. 
            console.log("ERROR: " + error);
        }
        else { 
            var results = [];
            var j;
            for(j = 0; j < trackedWords.length; j++) {
                results.push({
                    key:trackedWords[j],
                    count:count[j]
                });
            }
            res.json(results);
        }
    })
});
// Gets the list of happy words and converts it to a json  object. 
app.get("/happyWords.json", function (req, res) {
    res.json(happyWords);
});
// Gets the list of sad words and converts it to a json object. 
app.get("/sadWords.json", function (req, res) {
    res.json(sadWords);
});
    
