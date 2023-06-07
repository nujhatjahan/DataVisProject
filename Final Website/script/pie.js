
$(document).ready(function () {
  Plot();
});

var pieData = [
  {
    "Education": "Less than 9th Grade",
    "Immigrants": 16
  },
  {
    "Education": "9th-12th grade",
    "Immigrants": 9
  },
  {
    "Education": "High School Diploma",
    "Immigrants": 22
  },
  {
    "Education": "Associate's Degree",
    "Immigrants": 19
  },
  {
    "Education": "Bachelor's Degree or Higher",
    "Immigrants": 34
  }
  ];
  
  var pieValue = [{
  "captions": [
      { "Less than 9th Grade": "Less than 9th Grade",
       "9th-12th grade": "9th-12th grade" ,
     "High School Diploma": "High School Diploma" ,
       "Associate's Degree": "Associate's Degree" ,
       "Bachelor's Degree or Higher": "Bachelor's Degree or Higher" }
  ],
  "color": [
      { "Less than 9th Grade": "#3191ff" ,
       "9th-12th grade": "#d8296a" ,
       "High School Diploma": "#19c58d" ,
       "Associate's Degree": "#ffd819" ,
       "Bachelor's Degree or Higher": "#8f52b7" }
  ],
  "xaxis": "Education",
  "yaxis": "Immigrants"
  }];

  
function Plot() {
  TransformpieData(pieData, pieValue);
  BuildPie("chart", pieData, pieValue);
}


function BuildPie(id, pieData, options) {
  var xVariable;
  var divRatio = 2.5;
  var legendNewSet = 0;

  chart = d3.select("#" + id + " .innerCont");

  var yVariable = options[0].yaxis;
  width = $(chart[0]).outerWidth(),
  height = $(chart[0]).outerHeight(),
  radius = Math.min(width, height) / divRatio;

  xVariable = options[0].xaxis;


  var pieColor = d3.scale.ordinal().range(runningColors);

  arc = d3.svg.arc()
          .outerRadius(radius)
          .innerRadius(radius - 195);

  var arcOver = d3.svg.arc().outerRadius(radius + 20).innerRadius(radius - 180);

  chart = chart
          .append("svg")  //append svg element inside #chart
          .attr("width", width)    //set width
          .attr("height", height)  //set height
          .append("g")
          .attr("transform", "translate(" + (width/ divRatio) + "," + ((height / divRatio) + 30) + ")");

  var pie = d3.layout.pie()
              .sort(null)
              .value(function (d) {
                  return d.Immigrants;
              });

  var g = chart.selectAll(".arc")
              .data(pie(runningData))
              .enter().append("g")
              .attr("class", "arc");

  var count = 0;

  var path = g.append("path")
              .attr("d", arc)
              .attr("id", function (d) { return "arc-" + (count++); })
              .style("opacity", function (d) {
                  return d.data["op"];
              });

  path.on("mouseenter", function (d) {
      d3.select(this)
          .attr("stroke", "white")
          .transition()
          .duration(200)
          .attr("d", arcOver)
          .attr("stroke-width", 1);
  })
   .on("mouseleave", function (d) {
       d3.select(this).transition()
           .duration(200)
           .attr("d", arc)
           .attr("stroke", "none");
   })

  path.append("svg:title")
  .text(function (d) {
      return d.data["title"] + " (" + d.data[yVariable] + "%)";
  });

  path.style("fill", function (d) {
      return pieColor(d.data[xVariable]);
  })

  g.append("text")
   .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
   .attr("dy", ".35em")
   .style("text-anchor", "middle")
   .style("opacity", 1)
   .style("font-size", "16px")
   .text(function (d) {
       return d.data[yVariable] + "%";
   });


  count = 0;
  var legend = chart.selectAll(".legend")
      .data(runningData).enter()
      .append("g").attr("class", "legend")
      .attr("legend-id", function (d) {
          return count++;
      })
      .attr("transform", function (d, i) {
          return "translate(15," + (parseInt("-" + (runningData.length * 15)) + i * 38 + legendNewSet) + ")";
      })
      .style("cursor", "pointer")

      .on("click", function () {
          var oarc = d3.select("#" + id + " #arc-" + $(this).attr("legend-id"));
          oarc.style("opacity", 0.3)
          .attr("stroke", "white")
          .transition()
          .duration(200)
          .attr("d", arcOver)
          .attr("stroke-width", 1);
          setTimeout(function () {
              oarc.style("opacity", function (d) {
                  return d.data["op"];
              })
              .attr("d", arc)
              .transition()
              .duration(200)
              .attr("stroke", "none");
          }, 1000);
      });

  var leg = legend.append("rect");

  leg.attr("x", width / 3)
      .attr("width", 18).attr("height", 18)
      .style("fill", function (d) {
          return pieColor(d[yVariable]);
      })
  legend.append("text").attr("x", (width / 3) + 25)
      .attr("y", 9).attr("dy", ".35em")
      .style("text-anchor", "start").text(function (d) {
          return d.caption;
      });

  leg.append("svg:title")
  .text(function (d) {
      return d["title"] + " (" + d[yVariable] + ")";
  });

}

function TransformpieData(pieData, opts) {
  var result = [];
  var resultColors = [];
  var counter = 0;
  var hasMatch;
  var xVariable;
  var yVariable = opts[0].yaxis;

  xVariable = opts[0].xaxis;

  for (var i in pieData) {
      hasMatch = false;
      for (var index = 0; index < result.length; ++index) {
          var data = result[index];

          if (data[xVariable] == pieData[i][xVariable]) {
              result[index][yVariable] = result[index][yVariable] + pieData[i][yVariable];
              hasMatch = true;
              break;
          }
      }
      if (hasMatch == false) {
          ditem = {};
          ditem[xVariable] = pieData[i][xVariable];
          ditem[yVariable] = pieData[i][yVariable];
          ditem["caption"] = opts[0].captions != undefined ? opts[0].captions[0][pieData[i][xVariable]] : "";
          ditem["title"] = opts[0].captions != undefined ? opts[0].captions[0][pieData[i][xVariable]] : "";
          result.push(ditem);

          resultColors[counter] = opts[0].color != undefined ? opts[0].color[0][pieData[i][xVariable]] : "";

          counter += 1;
      }
  }

  runningData = result;
  runningColors = resultColors;
  return;
}

function showTable() {
    var chartContainer = document.getElementById("chartContainer");
    var tableContainer = document.getElementById("tableContainer");
    chartContainer.style.display = "none";
    tableContainer.style.display = "block";
  }

  function showChart() {
    var chartContainer = document.getElementById("chartContainer");
    var tableContainer = document.getElementById("tableContainer");
    chartContainer.style.display = "block";
    tableContainer.style.display = "none";
    
    // Create your pie chart using SVG here
    var svg = document.getElementById("chart");
    // Add your pie chart code here
  }