$(document).ready(function () {
  Plot();
});

// Function to initialize the plot
function Plot() {
  TransformChartData(chartData, chartOptions); // Transform the data based on chart options
  BuildBar("chart", chartData, chartOptions); // Build the bar chart
}

// Function to build the bar chart
function BuildBar(id, chartData, options, level) {
  chart = d3.select("#" + id + " .innerCont");

  // Set margins and dimensions for the chart
  var margin = { top: 50, right: 20, bottom: 30, left: 60 },
    width = $(chart[0]).outerWidth() - margin.left - margin.right,
    height = $(chart[0]).outerHeight() - margin.top - margin.bottom;

  var xVarName;
  var yVarName = options[0].yaxis;

  // Determine the variable names for x and y axes based on the level
  if (level == 1) {
    xVarName = options[0].xaxisl1;
  } else {
    xVarName = options[0].xaxis;
  }

  // Extract data arrays for x, y, and captions
  var xAry = runningData.map(function (el) {
    return el[xVarName];
  });

  var yAry = runningData.map(function (el) {
    return el[yVarName];
  });

  var capAry = runningData.map(function (el) {
    return el.caption;
  });

  // Define scales for x and y axes
  var x = d3.scale.ordinal().domain(xAry).rangeRoundBands([0, width], 0.5);
  var y = d3.scale
    .linear()
    .domain([
      0,
      d3.max(runningData, function (d) {
        return d[yVarName];
      }),
    ])
    .range([height, 0]);
  var rcolor = d3.scale.ordinal().range(runningColors);

  // Create an SVG element for the chart
  chart = chart
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Create groups for each bar in the chart
  var bar = chart
    .selectAll("g")
    .data(runningData)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d[xVarName]) + ", 0)";
    });

  var ctrtxt = 0;
  var xAxis = d3.svg
    .axis()
    .scale(x)
    //.orient("bottom").ticks(xAry.length).tickValues(capAry);  //orient bottom because x-axis tick labels will appear on the
    .orient("bottom")
    .ticks(xAry.length)
    .tickFormat(function (d) {
      if (level == 0) {
        var mapper = options[0].captions[0];
        return mapper[d];
      } else {
        var r = runningData[ctrtxt].caption;
        ctrtxt += 1;
        return r;
      }
    });

  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5); //orient left because y-axis tick labels will appear on the left side of the axis.

  // Append rectangles for each bar
  bar
    .append("rect")
    .attr("y", function (d) {
      return y(d.Total) + margin.top - 15;
    })
    .attr("x", function (d) {
      return margin.left;
    })
    .on("mouseenter", function (d) {
      d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("height", function (d) {
          return height - y(d[yVarName]) + 5;
        })
        .attr("y", function (d) {
          return y(d.Total) + margin.top - 20;
        })
        .attr("width", x.rangeBand() + 10)
        .attr("x", function (d) {
          return margin.left - 5;
        })
        .transition()
        .duration(200);
    })
    .on("mouseleave", function (d) {
      d3.select(this)
        .attr("stroke", "none")
        .attr("height", function (d) {
          return height - y(d[yVarName]);
        })
        .attr("y", function (d) {
          return y(d[yVarName]) + margin.top - 15;
        })
        .attr("width", x.rangeBand())
        .attr("x", function (d) {
          return margin.left;
        })
        .transition()
        .duration(200);
    })
    .on("click", function (d) {
      if (this._listenToEvents) {
        // Reset inmediatelly
        d3.select(this).attr("transform", "translate(0,0)");
        // Change level on click if no transition has started
        path.each(function () {
          this._listenToEvents = false;
        });
      }
      d3.selectAll("#" + id + " svg").remove();
      if (level == 1) {
        TransformChartData(chartData, options, 0, d[xVarName]);
        BuildBar(id, chartData, options, 0);
      } else {
        var nonSortedChart = chartData.sort(function (a, b) {
          return (
            parseFloat(b[options[0].yaxis]) - parseFloat(a[options[0].yaxis])
          );
        });
        TransformChartData(nonSortedChart, options, 1, d[xVarName]);
        BuildBar(id, nonSortedChart, options, 1);
      }
    });

  // Update the attributes and styles of the bars
  bar
    .selectAll("rect")
    .attr("height", function (d) {
      return height - y(d[yVarName]);
    })
    .transition()
    .delay(function (d, i) {
      return i * 300;
    })
    .duration(1000)
    .attr("width", x.rangeBand()) //set width base on range on ordinal data
    .transition()
    .delay(function (d, i) {
      return i * 300;
    })
    .duration(1000);

  bar
    .selectAll("rect")
    .style("fill", function (d) {
      return rcolor(d[xVarName]);
    })
    .style("opacity", function (d) {
      return d["op"];
    });

  bar
    .append("text")
    .attr("x", x.rangeBand() / 2 + margin.left + 20)
    .attr("y", function (d) {
      return y(d[yVarName]) + margin.top - 25;
    })
    .attr("dy", ".35em")
    .text(function (d) {
      return d[yVarName];
    });

  bar.append("svg:title").text(function (d) {
    //return xVarName + ":  " + d["title"] + " \x0A" + yVarName + ":  " + d[yVarName];
    return d["title"] + " (" + d[yVarName] + ")";
  });

  // Append x and y axes to the chart
  chart
    .append("g")
    .attr("class", "x axis")
    .attr(
      "transform",
      "translate(" + (margin.left + 10) + "," + (height + margin.top - 15) + ")"
    )
    .call(xAxis);

  chart
    .append("g")
    .attr("class", "y axis")
    .attr(
      "transform",
      "translate(" + (margin.left + 10) + "," + (margin.top - 15) + ")"
    )
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  if (level == 1) {
    chart
      .select(".x.axis")
      .selectAll("text")
      .attr("transform", " translate(-20,10) rotate(-35)");
  }
}

// Function to transform the chart data
function TransformChartData(chartData, opts, level, filter) {
  var result = [];
  var resultColors = [];
  var counter = 0;
  var hasMatch;
  var xVarName;
  var yVarName = opts[0].yaxis;

  if (level == 1) {
    xVarName = opts[0].xaxisl1;

    for (var i in chartData) {
      hasMatch = false;
      for (var index = 0; index < result.length; ++index) {
        var data = result[index];

        if (
          data[xVarName] == chartData[i][xVarName] &&
          chartData[i][opts[0].xaxis] == filter
        ) {
          result[index][yVarName] =
            result[index][yVarName] + chartData[i][yVarName];
          hasMatch = true;
          break;
        }
      }
      if (hasMatch == false && chartData[i][opts[0].xaxis] == filter) {
        if (result.length < 11) {
          ditem = {};
          ditem[xVarName] = chartData[i][xVarName];
          ditem[yVarName] = chartData[i][yVarName];
          ditem["caption"] = chartData[i][xVarName];
          ditem["title"] = chartData[i][xVarName];
          ditem["op"] = 1.0 - parseFloat("0." + result.length);
          result.push(ditem);

          resultColors[counter] = opts[0].color[0][chartData[i][opts[0].xaxis]];

          counter += 1;
        }
      }
    }
  } else {
    xVarName = opts[0].xaxis;

    for (var i in chartData) {
      hasMatch = false;
      for (var index = 0; index < result.length; ++index) {
        var data = result[index];

        if (data[xVarName] == chartData[i][xVarName]) {
          result[index][yVarName] =
            result[index][yVarName] + chartData[i][yVarName];
          hasMatch = true;
          break;
        }
      }
      if (hasMatch == false) {
        ditem = {};
        ditem[xVarName] = chartData[i][xVarName];
        ditem[yVarName] = chartData[i][yVarName];
        ditem["caption"] =
          opts[0].captions != undefined
            ? opts[0].captions[0][chartData[i][xVarName]]
            : "";
        ditem["title"] =
          opts[0].captions != undefined
            ? opts[0].captions[0][chartData[i][xVarName]]
            : "";
        ditem["op"] = 1;
        result.push(ditem);

        resultColors[counter] =
          opts[0].color != undefined
            ? opts[0].color[0][chartData[i][xVarName]]
            : "";

        counter += 1;
      }
    }
  }

  runningData = result;
  runningColors = resultColors;
  return;
}

var chartData = [
  {
    Country: "Mexico",
    Year: "2011",
    Total: 143446,
  },
  {
    Country: "Mexico",
    Year: "2012",
    Total: 146406,
  },
  {
    Country: "Mexico",
    Year: "2013",
    Total: 135028,
  },
  {
    Country: "Mexico",
    Year: "2014",
    Total: 134052,
  },
  {
    Country: "Mexico",
    Year: "2015",
    Total: 158619,
  },
  {
    Country: "Mexico",
    Year: "2016",
    Total: 174534,
  },
  {
    Country: "Mexico",
    Year: "2017",
    Total: 170581,
  },
  {
    Country: "Mexico",
    Year: "2018",
    Total: 161858,
  },
  {
    Country: "Mexico",
    Year: "2019",
    Total: 156052,
  },
  {
    Country: "Mexico",
    Year: "2020",
    Total: 100325,
  },
  {
    Country: "China",
    Year: "2011",
    Total: 87016,
  },
  {
    Country: "China",
    Year: "2012",
    Total: 81784,
  },
  {
    Country: "China",
    Year: "2013",
    Total: 71798,
  },
  {
    Country: "China",
    Year: "2014",
    Total: 76089,
  },
  {
    Country: "China",
    Year: "2015",
    Total: 74558,
  },
  {
    Country: "China",
    Year: "2016",
    Total: 81772,
  },
  {
    Country: "China",
    Year: "2017",
    Total: 71565,
  },
  {
    Country: "China",
    Year: "2018",
    Total: 65214,
  },
  {
    Country: "China",
    Year: "2019",
    Total: 62248,
  },
  {
    Country: "China",
    Year: "2020",
    Total: 41483,
  },
  {
    Country: "India",
    Year: "2011",
    Total: 69013,
  },
  {
    Country: "India",
    Year: "2012",
    Total: 66434,
  },
  {
    Country: "India",
    Year: "2013",
    Total: 68458,
  },
  {
    Country: "India",
    Year: "2014",
    Total: 77908,
  },
  {
    Country: "India",
    Year: "2015",
    Total: 64116,
  },
  {
    Country: "India",
    Year: "2016",
    Total: 64687,
  },
  {
    Country: "India",
    Year: "2017",
    Total: 60394,
  },
  {
    Country: "India",
    Year: "2018",
    Total: 59821,
  },
  {
    Country: "India",
    Year: "2019",
    Total: 54495,
  },
  {
    Country: "India",
    Year: "2020",
    Total: 46363,
  },
  {
    Country: "Cuba",
    Year: "2011",
    Total: 36452,
  },
  {
    Country: "Cuba",
    Year: "2012",
    Total: 32820,
  },
  {
    Country: "Cuba",
    Year: "2013",
    Total: 32219,
  },
  {
    Country: "Cuba",
    Year: "2014",
    Total: 46679,
  },
  {
    Country: "Cuba",
    Year: "2015",
    Total: 54396,
  },
  {
    Country: "Cuba",
    Year: "2016",
    Total: 66516,
  },
  {
    Country: "Cuba",
    Year: "2017",
    Total: 65028,
  },
  {
    Country: "Cuba",
    Year: "2018",
    Total: 76486,
  },
  {
    Country: "Cuba",
    Year: "2019",
    Total: 41641,
  },
  {
    Country: "Cuba",
    Year: "2020",
    Total: 16367,
  },
  {
    Country: "Vietnam",
    Year: "2011",
    Total: 34157,
  },
  {
    Country: "Vietnam",
    Year: "2012",
    Total: 28304,
  },
  {
    Country: "Vietnam",
    Year: "2013",
    Total: 27101,
  },
  {
    Country: "Vietnam",
    Year: "2014",
    Total: 30283,
  },
  {
    Country: "Vietnam",
    Year: "2015",
    Total: 30832,
  },
  {
    Country: "Vietnam",
    Year: "2016",
    Total: 41451,
  },
  {
    Country: "Vietnam",
    Year: "2017",
    Total: 38231,
  },
  {
    Country: "Vietnam",
    Year: "2018",
    Total: 33834,
  },
  {
    Country: "Vietnam",
    Year: "2019",
    Total: 39712,
  },
  {
    Country: "Vietnam",
    Year: "2020",
    Total: 29995,
  },
  {
    Country: "El Salvador",
    Year: "2011",
    Total: 18667,
  },
  {
    Country: "El Salvador",
    Year: "2012",
    Total: 16256,
  },
  {
    Country: "El Salvador",
    Year: "2013",
    Total: 18260,
  },
  {
    Country: "El Salvador",
    Year: "2014",
    Total: 19273,
  },
  {
    Country: "El Salvador",
    Year: "2015",
    Total: 19487,
  },
  {
    Country: "El Salvador",
    Year: "2016",
    Total: 23449,
  },
  {
    Country: "El Salvador",
    Year: "2017",
    Total: 25109,
  },
  {
    Country: "El Salvador",
    Year: "2018",
    Total: 28326,
  },
  {
    Country: "El Salvador",
    Year: "2019",
    Total: 27656,
  },
  {
    Country: "El Salvador",
    Year: "2020",
    Total: 17907,
  },
  {
    Country: "South Korea",
    Year: "2011",
    Total: 22824,
  },
  {
    Country: "South Korea",
    Year: "2012",
    Total: 20846,
  },
  {
    Country: "South Korea",
    Year: "2013",
    Total: 23166,
  },
  {
    Country: "South Korea",
    Year: "2014",
    Total: 20423,
  },
  {
    Country: "South Korea",
    Year: "2015",
    Total: 17138,
  },
  {
    Country: "South Korea",
    Year: "2016",
    Total: 21801,
  },
  {
    Country: "South Korea",
    Year: "2017",
    Total: 19194,
  },
  {
    Country: "South Korea",
    Year: "2018",
    Total: 17676,
  },
  {
    Country: "South Korea",
    Year: "2019",
    Total: 18479,
  },
  {
    Country: "South Korea",
    Year: "2020",
    Total: 16244,
  },
  {
    Country: "Jamaica",
    Year: "2011",
    Total: 19662,
  },
  {
    Country: "Jamaica",
    Year: "2012",
    Total: 20705,
  },
  {
    Country: "Jamaica",
    Year: "2013",
    Total: 19400,
  },
  {
    Country: "Jamaica",
    Year: "2014",
    Total: 19026,
  },
  {
    Country: "Jamaica",
    Year: "2015",
    Total: 17642,
  },
  {
    Country: "Jamaica",
    Year: "2016",
    Total: 23350,
  },
  {
    Country: "Jamaica",
    Year: "2017",
    Total: 21905,
  },
  {
    Country: "Jamaica",
    Year: "2018",
    Total: 20347,
  },
  {
    Country: "Jamaica",
    Year: "2019",
    Total: 21689,
  },
  {
    Country: "Jamaica",
    Year: "2020",
    Total: 12826,
  },
  {
    Country: "Haiti",
    Year: "2011",
    Total: 22111,
  },
  {
    Country: "Haiti",
    Year: "2012",
    Total: 22818,
  },
  {
    Country: "Haiti",
    Year: "2013",
    Total: 20351,
  },
  {
    Country: "Haiti",
    Year: "2014",
    Total: 15274,
  },
  {
    Country: "Haiti",
    Year: "2015",
    Total: 16967,
  },
  {
    Country: "Haiti",
    Year: "2016",
    Total: 23584,
  },
  {
    Country: "Haiti",
    Year: "2017",
    Total: 21824,
  },
  {
    Country: "Haiti",
    Year: "2018",
    Total: 21360,
  },
  {
    Country: "Haiti",
    Year: "2019",
    Total: 17253,
  },
  {
    Country: "Haiti",
    Year: "2020",
    Total: 9338,
  },
  {
    Country: "Colombia",
    Year: "2011",
    Total: 22635,
  },
  {
    Country: "Colombia",
    Year: "2012",
    Total: 20931,
  },
  {
    Country: "Colombia",
    Year: "2013",
    Total: 21131,
  },
  {
    Country: "Colombia",
    Year: "2014",
    Total: 18175,
  },
  {
    Country: "Colombia",
    Year: "2015",
    Total: 17316,
  },
  {
    Country: "Colombia",
    Year: "2016",
    Total: 18610,
  },
  {
    Country: "Colombia",
    Year: "2017",
    Total: 17956,
  },
  {
    Country: "Colombia",
    Year: "2018",
    Total: 17545,
  },
  {
    Country: "Colombia",
    Year: "2019",
    Total: 19841,
  },
  {
    Country: "Colombia",
    Year: "2020",
    Total: 11989,
  },
];

chartOptions = [
  {
    captions: [
      {
        Mexico: "Mexico",
        China: "China",
        India: "India",
        Cuba: "Cuba",
        Vietnam: "Vietnam",
        "El Salvador": "Salvador",
        "South Korea": "S.Korea",
        Jamaica: "Jamaica",
        Haiti: "Haiti",
        Colombia: "Colombia",
      },
    ],
    color: [
      {
        Mexico: "#FFA500",
        China: "#0070C0",
        India: "#ff0000",
        Cuba: "#00FF00",
        Vietnam: "#FF00FF",
        "El Salvador": "#FFFF00",
        "South Korea": "#800080",
        Jamaica: "#FFC0CB",
        Haiti: "#008000",
        Colombia: "#FFD700",
      },
    ],
    xaxis: "Country",
    xaxisl1: "Year",
    yaxis: "Total",
  },
];
