function init() {
    var w = 600;
    var h = 400;
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    // Set up scales
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05)
        .paddingOuter(0.1); // Add padding between groups

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d3.max([d.apples, d.oranges, d.grapes]);
        })])
        .range([h, 0]);

        var colors = d3.scaleOrdinal(d3.schemeDark2);



    // Set up the SVG
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var groups = svg.selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(" + xScale(i) + ",0)"; // Translate each group
        });

    var rects = groups.selectAll("rect")
        .data(function(d) { return Object.values(d); }) // Get an array of values for each group
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale.bandwidth() / 3* i; // Adjust x position within each group
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth() / 3) // Adjust width of each bar within a group
        .style("fill", function(d, i) {
            return colors(i % 3); // Use modulo operator to repeat colors for each group
        })
        .style("opacity", 1)
        .on("mouseover", function(d) {
            // Get the bar value
            var value = d3.select(this).data()[0];


            // Transition effect
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 0.7);
        })
        .on("mouseout", function() {
            

            // Transition effect
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1);
        });
}

window.onload = init;
