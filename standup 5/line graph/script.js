// // HTML element dimensions
// var width = 600;
// var height = 400;

// // Load the dataset
// d3.csv("linedataset.csv").then(function(data) {
//   // Parse the data
//   data.forEach(function(d) {
//     d.Year = +d.Year;
//     d.Immigrants = +d.Immigrants;
//     d.Refugees = +d.Refugees;
//     d.Apprehensions = +d.Apprehensions;
//     d.Removals = +d.Removals;
//     d.Returns = +d.Returns;
//   });

//   // Create the SVG element
//   var svg = d3.select("#graph")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

//   // Define the scales for x and y axes
//   var xScale = d3.scaleLinear()
//     .domain([2011, 2021])
//     .range([0, width]);

//   var yScale = d3.scaleLinear()
//     .domain([0, d3.max(data, function(d) {
//       return d3.max([d.Immigrants, d.Refugees, d.Apprehensions, d.Removals, d.Returns]);
//     })])
//     .range([height, 0]);

//   // Define the line functions
//   var line = d3.line()
//     .x(function(d) { return xScale(d.Year); })
//     .y(function(d) { return yScale(d.Value); });

//   // Define the line colors
//   var colors = ["red", "green", "blue", "orange", "purple"];

//   // Draw the lines
//   for (var i = 0; i < 5; i++) {
//     var columnName = Object.keys(data[0])[i + 1];

//     svg.append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", colors[i])
//       .attr("stroke-width", 2)
//       .attr("d", line.x(function(d) { return xScale(d.Year); }).y(function(d) { return yScale(d[columnName]); }));
//   }

//   // Add x-axis
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(xScale));

//   // Add y-axis
//   svg.append("g")
//     .call(d3.axisLeft(yScale));
// });

// HTML element dimensions
var width = 600;
var height = 400;

// Load the dataset
d3.csv("linedataset.csv").then(function(data) {
  // Parse the data
  data.forEach(function(d) {
    d.Year = +d.Year;
    d.Immigrants = +d.Immigrants;
    d.Refugees = +d.Refugees;
    d.Apprehensions = +d.Apprehensions;
    d.Removals = +d.Removals;
    d.Returns = +d.Returns;
  });

  // Create the SVG element
  var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Define the scales for x and y axes
  var xScale = d3.scaleLinear()
    .domain([2011, 2021])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d3.max([d.Immigrants, d.Refugees, d.Apprehensions, d.Removals, d.Returns]);
    })])
    .range([height, 0]);

  // Define the line functions
  var line = d3.line()
    .x(function(d) { return xScale(d.Year); })
    .y(function(d) { return yScale(d.Value); });

  // Define the line colors
  var colors = ["red", "green", "blue", "orange", "purple"];

  // Draw the lines
  for (var i = 0; i < 5; i++) {
    var columnName = Object.keys(data[0])[i + 1];

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colors[i])
      .attr("stroke-width", 2)
      .attr("d", line.x(function(d) { return xScale(d.Year); }).y(function(d) { return yScale(d[columnName]); }))
      .on("mouseover", function(d) {
        // Show tooltip
        // Implement tooltip display logic here
      })
      .on("mouseout", function(d) {
        // Hide tooltip
        // Implement tooltip hide logic here
      });
  }

  // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

    // Add transitions
    svg.selectAll("path")
    .transition()
    .duration(1000)
    .attr("d", line);

  svg.selectAll("g")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScale));

  svg.selectAll("g")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(yScale));

  // Add interactivity - Zoom and Pan
  var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed() {
    // Update the scales with the zoom event
    var newXScale = d3.event.transform.rescaleX(xScale);
    var newYScale = d3.event.transform.rescaleY(yScale);

    // Update the line and axis with new scales
    svg.selectAll("path")
      .attr("d", line.x(function(d) { return newXScale(d.Year); }).y(function(d) { return newYScale(d.Value); }));

    svg.selectAll("g")
      .call(d3.axisBottom(newXScale))
      .call(d3.axisLeft(newYScale));
  }
});

