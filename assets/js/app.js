//=======Start with SINGLE GRAPH =====//
//=========Define SVG Area and Margins=========//
//Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

//Define chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Append the SVG object to the body of the page
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a chart group
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//Initial Params
var chosenXAxis = "Age (Median)";
var chosenYAxis = "Obese (%)";

//Create a function for chosen X Axis
function xScale(cenData, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  //Create a transition
  xAxis.transition().duration(200).call(bottomAxis);
  return xAxis;
}

//Create a function for chosen Y Axis
function yScale(cenData, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  //Create a transition
  yAxis.transition().duration(200).call(leftAxis);
  return yAxis;
}

//Create a function to update the data points
function renderCircles(
  circlesGroup,
  newXScale,
  chosenXAxis,
  newYScale,
  chosenYAxis
) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]))
    .attr("cy", (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var xlabel;

  if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  } else if (chosenXAxis === "poverty") {
    xlabel = "In Poverty (%)";
  } else {
    xlabel = "Household Income (Median)";
  }

  var ylabel;

  if (chosenYAxis === "obesity") {
    ylabel = "Obese (%)";
  } else if (chosenYAxis === "smokes") {
    ylabel = "Smokes (%)";
  } else {
    ylabel = "Lacks Healthcare (%)";
  }

  //Hover over spot label
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return `${d.state}(${d.abbr})<br>${xlabel}:  ${d[chosenXAxis]} <br> ${ylabel}:  ${d[chosenYAxis]}`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//Load CSV data file into d3 object
d3.csv("assets/data/data.csv").then(function (cenData, err) {
  if (err) throw err;

  //parseData
  cenData.forEach(function (data) {
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.poverty = +data.poverty;
  });

  var smokes = [];
  var age = [];
  var state = [];
  for (i = 0; i < cenData.length; i++) {
    smokes.push(cenData[i].smokes);
    age.push(cenData[i].age);
    state.push(cenData[i].abbr);
  }

  //=========Create Axes=========//
  // scale y to chart height
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(smokes)])
    .range([chartHeight, 0]);
  svg.append("g").call(d3.axisLeft(yScale));

  // scale x to chart width
  var xScale = d3
    .scaleLinear()
    .domain([0, d3.max(age)])
    .range([0, chartWidth])
    .padding(0.05);
  svg.append("g").call(d3.axisBottom(xScale));

  //Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(cenData)
    .classed("stateCircle", true)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      return xScale(d.age);
    })
    .attr("cy", function (d, i) {
      return yScale(d.smokes);
    })
    .attr("r", 5);
});
