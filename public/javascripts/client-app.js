var main = function () {
    $.getJSON("/counts.json", function (response) {
        response.forEach(function (elt) {
          $("body").append("<p>"+elt.key+":"+elt.counts+"</p>");
        });
    });
};

$(document).ready(main);