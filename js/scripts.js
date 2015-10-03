var DEBUG = false;
var ACTIVE_USER = 'iamnbutler';
var LAST_FM = new LastFM({
    apiKey    : 'eb5004312b5007e85399ab8128cd90ff',
    apiSecret : '9b23d8f9a695517052683f6b80fe655a',
    cache     : new LastFMCache()
});
var DATASET = [];
var ARTISTS = [];
var WIDTH = 492;
var HEIGHT = 600;
var PADDING = 0;

$(document).ready(function() {
    $("#user").html(ACTIVE_USER);
    LAST_FM.library.getArtists({
       user : ACTIVE_USER 
    },{
        success : function (data) {
            data.artists.artist.forEach(function (a) {
                if (DEBUG) console.log (a.name + ' was played ' + a.playcount + ' times by ' + ACTIVE_USER);
                DATASET.push(a.playcount);
                ARTISTS.push(a.name);
            });
            
            barchart (DATASET, ARTISTS, WIDTH, HEIGHT, PADDING);
        },
        error   : function (data) {}
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
    var h = height || 100;
    var barPadding = padding || 1;
    var max = 0;
    data.forEach(function (value) {
        if (Number(max) < Number(value)) max = Number(value);
    });
    
    var svg = d3.select("#chart")
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
            return "rgb(0, 150, " + normalize(d, max, 255) + ")";
        });
    
    /* svg.selectAll("text")
        .data(labels)
        .enter()
        .append("text")
        .text(function(d, i) {
            return '' + d + ' (' + data[i] + ')';
        })
        .attr("x", function(d, i) {
            return i * (w / data.length) + 5;
        })
        .attr("y", function(d) {
            return h / 2 + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("transform", function (d, i) {
            return "rotate(90," + (i * (w / data.length) + 5) + "," + (h / 2 + 15) + ")";
        }); */
    
    return;
};

normalize = function (value, max, range) {
    return Math.round((value * range) / max);
};