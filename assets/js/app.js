//=========Define SVG Area and Margins=========//
//Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

//Define chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60,
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append the SVG object to the body of the page
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a chart group
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//======Set X Axes Functions ======//
//Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(cenData, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(cenData, (d) => d[chosenXAxis]) * 0.9,
      d3.max(cenData, (d) => d[chosenXAxis]) * 1.1,
    ])
    .range([0, width]);

  return xLinearScale;
}

//Create a function for chosen X Axis
function renderXScale(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  //Create a transition
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;
}

//======Set Y Axes Functions ======//
//Initial Params
var chosenYAxis = "obesity";

// function used for updating y-scale var upon click on axis label
function yScale(cenData, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(cenData, (d) => d[chosenYAxis]) * 0.9,
      d3.max(cenData, (d) => d[chosenYAxis]) * 1.1,
    ])
    .range([0, height]);

  return yLinearScale;
}

function renderYScale(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  //Create a transition
  yAxis.transition().duration(1000).call(leftAxis);
  return yAxis;
}

//Create a function to update the data points
function renderCircles(
  circlesGroup,
  newXScale,
  chosenXAxis,
  chosenYAxis,
  newYScale
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

//========Retrieve and Load CSV data=========//
d3.csv("/assets/data/data.csv")
  .then(function (cenData, err) {
    if (err) throw err;

    //parseData from string to integer
    cenData.forEach(function (data) {
      //y axis data
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      //x axis data
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.poverty = +data.income;
    });
    console.log(cenData);
    //Create axes linear scale
    var xLinearScale = xScale(cenData, chosenXAxis);
    var yLinearScale = yScale(cenData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + 15}, ${height - margin.bottom})`
      )
      .call(bottomAxis);

    chartGroup
      .append("g")
      .attr("transform", `translate(${margin.left * 1.2},${0 - margin.left})`)
      .call(leftAxis);

    var cirlesGroup = chartGroup
      .selectAll("circle")
      .data(cenData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", 10);

    //Create group labels for x-axis
    var labelsXGroup = chartGroup
      .append("g")
      .style("text-anchor", "middle")
      .attr("transform", `translate(${width / 1.6}, ${height + 10})`)
      .classed("aText", true);

    var ageLabel = labelsXGroup
      .append("text")
      .attr("value", "age") // value to grab for event listener
      .classed("active", true)
      .attr("x", 0)
      .attr("y", -30)
      .text("Age (Median)");

    var povertyLabel = labelsXGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("In Poverty (%)");

    var incomeLabel = labelsXGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 10)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    //Create group labels for y-axis
    var labelsYGroup = chartGroup
      .append("g")
      .attr("transform", "rotate(-90)")
      .attr("y", height / 2)
      .attr("x", 0 - margin.left)
      .attr("dy", "1em")
      .classed("aText", true);

    var obeseLabel = labelsYGroup
      .append("text")
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obese (%)");

    var smokeLabel = labelsYGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    var healthLabel = labelsYGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel.classed("active", true).classed("inactive", false);
      ageLabel.classed("active", false).classed("inactive", true);
      incomeLabel.classed("active", false).classed("inactive", true);
    } else if (chosenXAxis === "age") {
      povertyLabel.classed("active", false).classed("inactive", true);
      ageLabel.classed("active", true).classed("inactive", false);
      incomeLabel.classed("active", false).classed("inactive", true);
    } else {
      povertyLabel.classed("active", false).classed("inactive", true);
      ageLabel.classed("active", false).classed("inactive", true);
      incomeLabel.classed("active", true).classed("inactive", false);
    }
    // changes classes to change bold text Y axis
    if (chosenYAxis === "obesity") {
      obeseLabel.classed("active", true).classed("inactive", false);
      smokeLabel.classed("active", false).classed("inactive", true);
      healthLabel.classed("active", false).classed("inactive", true);
    } else if (chosenYAxis === "smokes") {
      obeseLabel.classed("active", false).classed("inactive", true);
      smokeLabel.classed("active", true).classed("inactive", false);
      healthLabel.classed("active", false).classed("inactive", true);
    } else {
      obeseLabel.classed("active", false).classed("inactive", true);
      smokeLabel.classed("active", false).classed("inactive", true);
      healthLabel.classed("active", true).classed("inactive", false);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
