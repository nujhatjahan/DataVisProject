// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(100)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3
  .scaleThreshold()
  .domain([0, 100, 500, 1000, 5000, 10000, 50000, 110000])
  .range(d3.schemeReds[8]);

// Loading the geojson file and the CSV file
d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  )
  .defer(d3.csv, "dataset/mapdata.csv", function (d) {
    data.set(d.code, +d.pop);
  })
  .await(ready);

// Tooltip for displaying information on hover
var tooltip = d3.select(".tooltip");

function ready(error, topo) {
  // Mouseover event handler
  let mouseOver = function (d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.2);

    d3.select(this)
      .transition()
      .duration(20)
      .style("opacity", 1)
      .style("stroke", "white");

    tooltip
      .style("opacity", 1)
      .html(
        "Country: " +
          d.properties.name +
          "<br>Immigrants: " +
          (data.get(d.id) || 0)
      )
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY - 25 + "px");
  };

  // Mouseleave event handler
  let mouseLeave = function (d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 1);

    d3.select(this).transition().duration(200).style("stroke", "transparent");

    tooltip.style("opacity", 0);
  };

  // Creating the legend
  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 20)");

  var legendRects = legend
    .selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function (d, i) {
      return i * 20;
    })
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function (d) {
      return d;
    });

  var legendLabels = legend
    .selectAll("text")
    .data(colorScale.domain())
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", function (d, i) {
      return i * 20 + 12;
    })
    .text(function (d) {
      return d;
    })
    .style("font-size", "12px");

  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .attr("class", function (d) {
      return "Country";
    })
    .style("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave);
}
