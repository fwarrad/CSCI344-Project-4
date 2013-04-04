var worker = function(trackedWords) {
  var twitter = require('ntwitter'),
      client = require("redis").createClient(), 
      credentials = require('./credentials.js');

  var t = new twitter({
      consumer_key: credentials.consumer_key,
      consumer_secret: credentials.consumer_secret,
      access_token_key: credentials.access_token_key,
      access_token_secret: credentials.access_token_secret
  });

  t.stream(
      'statuses/filter',
      { track: trackedWords},
      function(stream) {
          stream.on('data', function(tweet) {
            for (var i= 0; i < trackedWords.length; i++) {
                if(tweet.text.indexOf(trackedWords[i]) > - 1) {
                    // adds the value to a word
                    client.incr(trackedWords[i]);
                    console.log(trackedWords[i]);
                }// end of matching test
            }
            
            // For each word, word will be incrimented.
            /*trackedWords.forEach(function (trackedWords){
              if(tweet.text.match(trackedWords)) {
                  client.incr(trackedWords);
              }
            }); */
          });
      }
  );
};

module.exports = worker; 