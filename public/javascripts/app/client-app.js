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
            $(".counts").append("<p>Total Happy Counts: " + " " + happyCount + "</p>");
        })
        $.getJSON("/sadWords.json", function (sadWords) {
           sadCount = counter(element,sadWords,sadCount);
          $(".counts").append("<p>Total Sad Counts: " + " " + sadCount  +"</p>");
        })
    });
    // get list of happy words
    $.getJSON("/happyWords.json", function (element) {
        $(".happyWords").append('<p>happy words:' + " " + element);
    });
    // get list of sad words
    $.getJSON("/sadWords.json", function (element) {
        $(".sadWords").append('<p> sad words:' + " " + element);
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