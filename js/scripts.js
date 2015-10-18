// Do stuff
var height = 230, // height of chart
    width = 9900,
    barWidth = 24, // Width of Bar
    unitWidth = 54, // Width of one grid unit
    barSpace = unitWidth - barWidth;

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".app-chart-output")
    .attr("width", width)
    .attr("height", height);

d3.tsv("../data/data.tsv", type, function(error, data) {
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("id", function(d,i) { return i })
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + i * barSpace + ",0)"; })
      .attr("title", function(d) { return d.title; }) // Append Title
      .attr("artist", function(d) { return d.artist; }) // Append Artist
      .attr("album", function(d) { return d.album; }) // Append Album
      .attr("plays", function(d) { return d.value; }) // Append Value

  bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", barWidth)
      .attr("style", function(d, i) { return "fill: url(#g-" + i + ")"; });

  bar.append("text")
      .attr("x", (barWidth / 2) - 10)
      .attr("y", function(d) { return y(d.value) - 18; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });

  // Get list of artists

  var artists = [];
  artists = data.map(function(d) { return d.artist }).sort();

  var artists = artists.reduce(function(a,b){   // Remove duplicate artists
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);

  var artistList = d3.select(".artistDropdown");
  
  for (var i = 0; i < artists.length; i++) {
    artistList.append("option")
      .attr("value", i)
      .text(artists[i]);
  }

  // Get list of albums

  var albums = [];
  albums = data.map(function(d) { return d.album }).sort();

  var albums = albums.reduce(function(a,b){   // Remove duplicate albums
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);

  var albumList = d3.select(".albumDropdown");
  
  for (var i = 0; i < albums.length; i++) {
    albumList.append("option")
      .attr("value", i)
      .text(albums[i]);
  }

  // Get time added of each song
  // Get list of albums

  var dates = [];
  dates = data.map(function(d) { return d.dAdded });
  playsOrdered = data.map(function(d) { return d.value });

  for (var i = 0; i < dates.length; i++) {
    var c = Date.parse(dates[i]);
    z = (((c - 1400000000000)/1000) / 14734120) * (playsOrdered[i] - 8);
    dates[i] = (Math.floor(z));

    chart.select("defs").append("linearGradient")
      .attr("id", "g-" + i)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 1)
      .html(function() {
        // Define stops
        var defG1 = '<stop class="stop' + i + '-2" offset="0%"/>';
        var defG2 = '<stop class="stop' + i + '-1" offset="100%"/>';

        return defG1 + defG2;
      });

      chart.select("defs").append("style")
        .attr("type", "text/css")
        .html(function() {
          // Define svg gradient variables
          var stop1 = ".stop" + i + "-1 { stop-color: rgb(" + ( 60 + dates[i]) + ",24,225); stop-opacity: 1; }";
          var stop2 = ".stop" + i + "-2 { stop-color: rgb(" + ( 120 + dates[i]) + ", 42,84); stop-opacity: 1; }";

          return stop1 + stop2;
        });

  }

});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

$(document).ready(function(){
  // Scroll Horizontally

  // for scrollbar to work horizontally instead
  $(".app-chart").mousewheel(function(event, delta) {
    this.scrollLeft -= (delta * 30);
    event.preventDefault();
  });   

  // Hide overlay on clicking outside modal
  var overlay = $(".app-overlay");
  var modal = $(".app-overlay-inner");

  overlay.click(function(){
    modal.addClass('bounceOutUp');
    overlay.addClass('fadeOut');
    window.setTimeout(overlayCleanup, 800); // Wait to start the cleanup function
  });

  function overlayShow() { 
    overlay.show();  // Hide overlay for next use
    modal.show();

    modal.addClass('bounceInUp');
    overlay.addClass('fadeIn');
  }

  function overlayCleanup() { 
    overlay.hide();  // Hide overlay for next use
    modal.hide();

    modal.removeClass('bounceOutUp'); // Remove animated classes after hidden
    overlay.removeClass('fadeOut');
  }

  // Create and populate modal for clicked node
  function populateModal(node) {
    var title = node.attr('title'); // Set title
    $('#modal-i-title').html(title);

    var plays = node.attr('plays'); // Set plays
    $('#modal-i-plays').html(plays + " Plays");

    var artist = node.attr('artist'); // Set plays

    // Query YT for song name
    query = title + " - " + artist;
    ytKeyWordsearch(query);
  }

//-- YT: Search for song title
  function ytKeyWordsearch(query){
    gapi.client.setApiKey('AIzaSyCcoMFVU1juK4tpcn3OhQEb9QUO9rZVVFA');
    gapi.client.load('youtube', 'v3', function() {
            makeYTRequest(query);
    });
  }
  function makeYTRequest(query) {
    var q = query;
    var request = gapi.client.youtube.search.list({
               q: q,
            part: 'snippet'                        
    });
    request.execute(function(response) {
            var str = JSON.stringify(response.result);
            console.log(str);
    });
  }

//-- YT: Use videoId to create embed link

  // TODO: Click overlay for individual songs
  // TODO: Center modal properly
  $("#app-chart-output").on( 'click', '.bar', function(){
    var node = $(this);

    // Populate modal content
    populateModal(node);
    overlayShow();
    $(this).append('<div class="yay">zzz</div>');
  });

});