// Dimensions of the graph
const width = 600;
const height = 400;
const margin = { top: 50, right: 150, bottom: 50, left: 60 };

// Load the data from the CSV file
d3.csv("dataset/linedataset.csv").then(function (data) {
  // Convert data to numeric values
  data.forEach(function (d) {
    d.Year = +d.Year;
    d.Immigrants = +d.Immigrants;
    d.Refugees = +d.Refugees;
    d.Apprehensions = +d.Apprehensions;
    d.Removals = +d.Removals;
    d.Returns = +d.Returns;
  });

  // Create SVG element
  const svg = d3
    .select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create scales for x and y axes
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) =>
        d3.max([
          d.Immigrants,
          d.Refugees,
          d.Apprehensions,
          d.Removals,
          d.Returns,
        ])
      ),
    ])
    .range([height, 0]);

  // Create line generator functions for each category
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.Year))
    .y((d) => yScale(d.Immigrants));

  // Draw lines for each category and add category labels
  const categories = [
    "Legal Immigrants",
    "Refugee Arrivals",
    "Apprehensions",
    "Noncitizen Removals",
    "Noncitizen Returns",
  ];
  categories.forEach((category) => {
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr(
        "d",
        lineGenerator.y((d) => yScale(d[category]))
      )
      .style("stroke", getCategoryColor(category))
      .style("fill", "none");

    svg
      .append("text")
      .datum(data[data.length - 1])
      .attr("class", "category-label")
      .attr("x", width)
      .attr("y", (d) => yScale(d[category]))
      .attr("dx", 5)
      .attr("dy", 5)
      .text(category)
      .style("fill", getCategoryColor(category));
  });

  // Add x axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add y axis
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

  // Add labels to the axes
  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top - 10)
    .text("Years");

  // Function to get category color
  function getCategoryColor(category) {
    switch (category) {
      case "Legal Immigrants":
        return "blue";
      case "Refugee Arrivals":
        return "green";
      case "Apprehensions":
        return "red";
      case "Noncitizen Removals":
        return "orange";
      case "Noncitizen Returns":
        return "purple";
      default:
        return "black";
    }
  }

  // Add interactivity to the lines
  svg
    .selectAll(".line")
    .on("mouseover", function () {
      d3.select(this).style("stroke-width", "3px");
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke-width", "1.5px");
    });
});
