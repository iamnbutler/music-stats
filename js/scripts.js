var DEBUG = false;
var ACTIVE_USER = 'iamnbutler';
var LAST_FM = new LastFM({
    apiKey    : 'eb5004312b5007e85399ab8128cd90ff',
    apiSecret : '9b23d8f9a695517052683f6b80fe655a',
    cache     : new LastFMCache()
});
var DATASET = [];
var ARTISTS = [];
var WIDTH = $("#scrobbles-graph").width();
var HEIGHT = ($("#scrobbles-graph").height())*2;
var PADDING = 2;

// Supporting Functions

function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

// Last.fm API stuff

$(document).ready(function() {
    LAST_FM.library.getArtists({
       user : ACTIVE_USER ,
       limit : 30
    },{
        success : function (data) {
            data.artists.artist.forEach(function (a) {
                if (DEBUG) console.log (a.name + ' was played ' + a.playcount + ' times by ' + ACTIVE_USER);
                DATASET.push(a.playcount);
                ARTISTS.push(a.name);
            });
            
            console.log(data.artists);

            barchart (DATASET, ARTISTS, WIDTH, HEIGHT, PADDING);
        },
        error   : function (data) {}
    });

    // Get User info
    LAST_FM.user.getInfo({
       user : ACTIVE_USER
    }, {
        success : function (user) {
            $("#user").html(user.user.realname + "'s Profile");

            // Get # of scrobbles as a number with commas
            var scrobbles = user.user.playcount;
            var scrobblesFormatted = addCommas(user.user.playcount);
            $("#u-scrobbles-graph-count").html(scrobblesFormatted);
        },
        error   : function (user) {}
    });

    // Get User weekly chart
    LAST_FM.user.getWeeklyChartList({
       user : ACTIVE_USER
    }, {
        success : function (user) {
            console.log(user.weeklychartlist);
        },
        error   : function (user) {}
    });

    // Get User weekly chart
    LAST_FM.artist.getInfo({
       artist : 'Cher'
    }, {
        success : function (user) {
            console.log(artist);
        },
        error   : function (user) {}
    });
});

/**
 * Creates a bar chart from an array of data.
 * @param {Array} data
 * @param {Array} labels
 * @param {Number} width
 * @param {Number} height
 * @param {Number} padding
 * @returns {undefined}
 */
barchart = function (data, labels, width, height, padding) {
    var w = width || 500;
    var h = height || 300;
    var barPadding = padding || 1;
    var max = 0;
    data.reverse().forEach(function (value) {
        if (Number(max) < Number(value)) max = Number(value);
    });
    
    var svg = d3.select("#scrobbles-graph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w / data.length);
        })
        .attr("y", function(d) {
            return (h - normalize(d, max, h / 2)) - h / 2;
        })
        .attr("width", w / data.length - barPadding)
        .attr("height", function(d) {
            return normalize(d, max, h / 2);
        })
        .attr("fill", function(d) {
            return "rgb(255, 255, 255)";
        });

    return;
};

normalize = function (value, max, range) {
    return Math.round((value * range) / max);
};