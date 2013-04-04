var main = function () {
    var sadlist = [],
        happyList = [],
        trackedList = [],
        happyCount = 0,
        sadCount = 0,
        sgage,
        hgage,
        counter;
    // get counts for each word and category totals
    $.getJSON("/counts.json", function (element) {
        $.getJSON("/happyWords.json", function (happyWords) {
            happyCount = counter(element,happyWords,happyCount);
        }).done(function () {
                $(".counts").append("<p>Total Happy Counts: "+ happyCount + "</p>");
                    hgage = new JustGage({
                    id: "happyGauge",
                    value: happyCount,
                    min: 0,
                    max: 1000000,
                    title: "happy meter",
                    label: "happy words"
                });
            });
        $.getJSON("/sadWords.json", function (sadWords) {
           sadCount = counter(element,sadWords,sadCount);
        }).done(function () {
                $(".counts").append("<p>Total Sad count: " + sadCount  +"</p>");
                   sgage = new JustGage({
                   id: "sadGauge",
                   value: sadCount,
                   min: 0,
                   max: 1000000,
                   title: "sad meter",
                   label: "sad words"
                });
            });
    });
    // get list of happy words
    $.getJSON("/happyWords.json", function (element) {
        $(".Swords").append('<p>happy words:' + element);
    });
    // get list of sad words
    $.getJSON("/sadWords.json", function (element) {
        $(".Hwords").append('<p> sad words:' + element);
    });
    
    function counter (words, cat, catCount) {
        var count;
        for(var i = 0; i < words.length; i++) {
           if (cat.indexOf(words[i].key) > -1) {
                console.log(words[i].key,words[i].count);
                catCount = catCount + Number(words[i].count);
           }// end of if
        }// end of for
        console.log("Total count " +catCount);
    return catCount;
    }// end of counter
    
  

    
};
$(document).ready(main);