var height = 300, // height of chart
    width = 1400,
    barWidth = 40, // Width of Bar
    unitWidth = 162, // Width of one grid unit
    barSpace = unitWidth - barWidth;
    barMargin = barSpace / 2; // Margin on each side of bar unit

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".app-chart-output")
    .attr("width", width)
    .attr("height", height); // Set the height of chart

d3.csv("../data/data.tsv", function(error, data) {
    // var plays = [];
    // plays = data.map(function(d) { return d.plays });

    // console.log(plays);

    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var barWidth = width / data.length;

    // chart.attr("width", barSpace * data.length); // set the width of chart based of off how many units

    var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.value) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });

    // TODO: Calculate age of song in library from date added
    // TODO: Load values from CSV

        // !WRONG! var parseDate = d3.time.format("%Y-%m-%d,%_%I:%M%_%p").parse;

        console.log(data[0].value);

});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}