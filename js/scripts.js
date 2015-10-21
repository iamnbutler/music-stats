// Do stuff
var height = 450, // height of chart
    width = 9900,
    barWidth = 40, // Width of Bar
    unitWidth = 140, // Width of one grid unit
    barSpace = unitWidth - barWidth;

var y = d3.scale.linear()
    .range([height, 0]);

// ==========
// Get Data
// ==========

d3.tsv("data/data.tsv", type, function(error, data) {

  var chart = d3.select(".app-chart-output")
    .attr("width", function(d) { return (data.length * barSpace) + 400; })
    .attr("height", height + 100);
  
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("id", function(d,i) { return 'b' + i })
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + i * barSpace + ",0)"; })
      .attr("title", function(d) { return d.title; }) // Append Title
      .attr("artist", function(d) { return d.artist; }) // Append Artist
      .attr("album", function(d) { return d.album; }) // Append Album
      .attr("plays", function(d) { return d.value; }) // Append Value
      .attr("dAdded", function(d) { return d.dAdded; }) // Append Date
      .attr("rank", function(d) { return i; }) // Append Rank

  bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", barWidth)
      .attr("style", function(d, i) { return "fill: url(#g-" + i + ")"; });

  // // Chart labels
  // bar.append("text")
  //     .attr("x", (barWidth / 2) - 10)
  //     .attr("y", 440)
  //     .attr("dy", ".75em")
  //     .text(function(d) { return d.title; });

  // ==========
  // Labels
  // ==========

  chartLabels = d3.select("#chart-labels");

  $("#chart-labels").css("width", function(d) { return (data.length * barSpace) + 400; });

  $("#app-chart-output").on( 'mouseenter', '.bar', function(){
    var node = $(this);

    id = node.attr("id");
    title = node.attr("title");
    pos = node.position();
    posLeft = parseInt(pos.left) + 100;
    console.log(posLeft);

    var chartLabel = $('<div class="chart-label" id="label' + id + '" style="left: ' + posLeft + 'px">' + title + '</div>');

    chartLabel.appendTo(chartLabels);

    // TODO: Destroy labels on mouseout

  });

  $("#app-chart-output").on( 'mouseleave', '.bar', function(){
    chartLabels.html('');

  });

  // TODO: Get bar title + artist and add it to text element

  // ==========
  // Get properties for selects
  // ==========

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

  var dates = [];
  dates = data.map(function(d) { return d.dAdded });
  playsOrdered = data.map(function(d) { return d.value });

  for (var i = 0; i < dates.length; i++) {
    // Create "hotness" ratio
    var c = Date.parse(dates[i]);
    z = (((c - 1400000000000)/1000) / 14734120) * (playsOrdered[i] - 8);
    dates[i] = (Math.floor(z));

    // Generate gradients for each bar
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
  $(".app-chart").mousewheel(function(event, delta) {
    this.scrollLeft -= (delta * 30);
    event.preventDefault();
  });   

  // ==========
  // Modal
  // ==========

  // Hide overlay on clicking outside modal
  var overlay = $(".app-overlay");
  var info = $(".modal-info");
  var embed = $("#modal-video-embed");
  var close = $("#close");
  var timeout;

  function infoShow() { 
    // overlay.show();  // Hide overlay for next use
    info.show();

    info.removeClass('bounceOutRight').addClass('bounceInRight');

  }

  function videoShow() { 
    // overlay.show();  // Hide overlay for next use
    embed.show();
    $("#close").show().removeClass('bouncOut').addClass('fadeIn');

    embed.removeClass('bounceOutRight').addClass('bounceInRight');

  }

  function overlayCleanup() { 
    info.removeClass('bounceInRight').addClass('bounceOutRight');
    window.setTimeout(function(){ info.hide() }, 800);
  }

  // Create and populate modal for clicked node
  function populateModalInfo(node) {
    var title = node.attr('title'),
        album = node.attr('album'),
        artist = node.attr('artist'),
        // dateAdded = node.attr('dAdded'),
        // rank = node.attr('rank');
        plays = node.attr('plays'); // Set title
    $('#modal-i-title').html(title);
    $('#modal-i-artist').html(artist);
    $('#modal-i-album').html(album);
    $('#modal-i-plays').html(plays + " Plays");
    // $('#modal-i-date').html(dateAdded);
    // $('#modal-i-rank').html(rank);
    $('#footer-search').attr("href", "https://www.google.ca/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + artist + "%20-%20" + album);
    $('#footer-info').html(artist + " - " + album);
  }

  function populateModalVideo(node) {
    var title = node.attr('title'); // Set title
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
  //-- YT: Use videoId to create embed link
  function makeYTRequest(query) {
    var q = query;
    var request = gapi.client.youtube.search.list({
               q: q,
            part: 'snippet',
            maxResults: 1                        
    });
    request.execute(function(response) {
            var videoId = response.result.items[0].id.videoId
            var embedHtml = '<iframe width="300" height="169" src="https://www.youtube.com/embed/' + videoId +'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';
            embed.html(embedHtml);
    });
  }

  $("#app-chart-output").on( 'click', '.bar', function(){
    var node = $(this);

    // Populate modal content
    info.show();
    populateModalInfo(node);
    populateModalVideo(node);
    infoShow();
    videoShow();

  });

  close.click(function(){
    info.addClass('bounceOutRight');
    embed.addClass('bounceOutRight');
    close.removeClass('fadeIn').addClass('bounceOut');
    window.setTimeout(overlayCleanup, 800); // Wait to start the cleanup function
  });


  $("#app-chart-output").on( 'mouseenter', '.bar', function(){
    
  });

  // ==========
  // NUX
  // ==========

  $("#app-chart-output").on( 'click', '.bar', function(){
    $("#nux").addClass('animated bounceOutUp');
    $(".nux-bg").addClass('animated fadeOut');
  });

});