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
            // For each word, word will be incrimented.
            trackedWords.forEach(function (trackedWords){
              if(tweet.text.match(trackedWords)) {
                  client.incr(trackedWords);
              }
            });
          });
      }
  );
};

module.exports = worker; 