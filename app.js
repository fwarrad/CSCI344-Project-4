// We need to 'require' the                                                                                                                            
// following modules                                                                                                                    
var express = require("express"),
    http = require("http"),
    path = require("path"),
    redisClient = require("redis").createClient(),
    twitterWorker = require("./twitter.js"),
    app = express();

// start ntwitter and tracked words
// these are the only lines you should have to change for either sad or happy words
var happyWords = ["easier","interesting","honest","pal","warmth","rest","safe"];
var sadWords = ["anguished","tormented","heartbroken","bitter","tearfu","grieving","ignorant","sad"];
var trackedWords = happyWords.concat(sadWords);
console.log(trackedWords);
for(var i = 0; i< trackedWords.length; i++) {    redisClient.set(trackedWords[i], 0)   }
// start twitter    
//trackedWords = ["awesome", "cool", "rad", "gnarly", "banana", "sweet"];

// This is our basic configuration                                                                                                                     
app.configure(function () {
    // Define our static file directory, it will be 'public'                                                                                           
    app.use(express.static(path.join(__dirname, 'public')));
});

// Create the http server and get it to                                                                                                                
// listen on the specified port 3000                                                                                                                   
http.createServer(app).listen(3000, function(){
    console.log("Express server listening on port 3000");
});

// Create the Twitter Worker!
twitterWorker(trackedWords);

app.get("/", function (req, res) {
    //send "Hello World" to the client as html
    res.send("Hello World!");
});

app.get("/goodbye", function (req, res) {
    //send "Goodbye World" to the client as html
    res.send("Goodbye World!");
});

app.get("/login", function (req, res) {
    res.send("You need to login!");
});

app.get("/counts.json", function	(req, res) {
    redisClient.mget(trackedWords, function	(error, counts) {
	    if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
      } else {
            var result = [],
                i;
            for(i = 0; i < trackedWords.length; i = i + 1) {
              result.push({
                "key":trackedWords[i],
                "counts":counts[i]
              });
            }
            console.log("ABOUT TO SEND:");
            console.log(result);
            // use res.json to return JSON objects instead of strings
            res.json(result);
        }
    });
});

app.get("/happyWords.json", function (req, res) {
    res.json(happyWords);
});// list the sad words as json object
app.get("/sadWords.json", function (req, res) {
    res.json(sadWords);
});