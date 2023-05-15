
function init() {
    var w = 600;
    var h = 400;
    var dataset = [];

    // Set up scales
    var xScale = d3.scaleBand()
        .rangeRound([0, w])
        .paddingInner(0.05)
        .paddingOuter(0.1);

    var yScale = d3.scaleLinear()
        .range([h, 0]);

    var colors = d3.scaleOrdinal(d3.schemeDark2);

    // Set up the SVG
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    d3.csv("top10_dataset.xlsx").then(function(data) {
        // Process the loaded data
        dataset = data.map(function(d) {
            return {
                country: d.country,
                a: +d["2010"],
                b: +d["2015"],
                c: +d["2020"]
            };
        });

        // Update scales with the loaded data
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset, function(d) {
            return d3.max([d.a, d.b, d.c]);
        })]);

        // Draw the chart
        var groups = svg.selectAll("g")
            .data(dataset)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return "translate(" + xScale(i) + ",0)";
            });

        var rects = groups.selectAll("rect")
            .data(function(d) { return Object.values(d).slice(1); })
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return xScale.bandwidth() / 3 * i;
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("height", function(d) {
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth() / 3)
            .style("fill", function(d, i) {
                return colors(i % 3);
            })
            .style("opacity", 1)
            .on("mouseover", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.7);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
            });
    }).catch(function(error) {
        console.log("Error loading data:", error);
    });
}

window.onload = init;

