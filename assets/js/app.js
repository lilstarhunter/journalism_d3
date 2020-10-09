//=========Define SVG Area and Margins=========//
//Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 600;
//Define chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};
// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append the SVG object to the body of the page
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); //extra padding for third label

// Append a chart group
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart");

//Initial Params
var chosenXAxis = "age";
var chosenYAxis = "obesity";

//======Set Axes Functions ======//
// function used for updating x-scale variable upon click on axis label
function xScale(cenData, chosenXAxis) {
  //create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(cenData, (d) => d[chosenXAxis]) * 0.9,
      d3.max(cenData, (d) => d[chosenXAxis]) * 1.1,
    ])
    .range([0, width]);
  //Returns the X axis no Label - ticks based on chosen X axis
  return xLinearScale;
}

function yScale(cenData, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(cenData, (d) => d[chosenYAxis]) - 1,
      d3.max(cenData, (d) => d[chosenYAxis]) + 1,
    ])
    .rangeRound([height, 0]);
  return yLinearScale;
}

//Create a function for updating chosen X Axis upon label click
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  //Create a transition
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;
}

//Create a function for updating chosen Y Axis upon label click
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition().duration(1000).call(leftAxis);
  return yAxis;
}

// functions used for updating circles group with a transition to
// new circles for both X and Y coordinates
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cy", (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// functions used for updating circles text with a transition on
// new circles for both X and Y coordinates
function renderXText(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("dx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("dy", (d) => newYScale(d[chosenYAxis]) + 5);

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
  var xlabel = "";
  if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  } else if (chosenXAxis === "poverty") {
    xlabel = "In Poverty (%)";
  } else {
    xlabel = "Household Income (Median)";
  }
  var ylabel = "";
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
    .offset([50, -75])
    .html(function (d) {
      return `${d.state}(${d.abbr})<br>${xlabel}:  ${d[chosenXAxis]} <br> ${ylabel}:  ${d[chosenYAxis]}`;
    });

  circlesGroup.call(toolTip);
  circlesGroup
    .on("mouseover", (data) => {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", (data, index) => {
      toolTip.hide(data, this);
    });
  return circlesGroup;
}
//========Retrieve and Load CSV data=========//
d3.csv("assets/data/data.csv")
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
      data.income = +data.income;
    });

    // console.log(cenData);
    //Initialize scale functions
    var xLinearScale = xScale(cenData, chosenXAxis);
    var yLinearScale = yScale(cenData, chosenYAxis);

    // Initialize Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x  & y axis
    var xAxis = chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(bottomAxis);
    var yAxis = chartGroup.append("g").call(leftAxis);

    //Create scatterplot and append initial cirlces
    var circlesGroup = chartGroup
      .selectAll("g circle")
      .data(cenData)
      .enter()
      .append("g");

    var circlesXY = circlesGroup
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .classed("stateCircle", true);

    //Add abbr label to circles
    var circlesText = circlesGroup
      .append("text")
      .text((d) => d.abbr)
      .attr("dx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("dy", (d) => yLinearScale(d[chosenYAxis]) + 5)
      .classed("stateText", true);

    //Create group labels for x-axis
    var xlabelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height})`)
      .classed("aText", true);

    var ageLabel = xlabelsGroup
      .append("text")
      .attr("value", "age") // value to grab for event listener
      .classed("active", true)
      .attr("x", 0)
      .attr("y", 40)
      // .attr("dx", "1em")
      .text("Age (Median)");
    var povertyLabel = xlabelsGroup
      .append("text")
      .attr("value", "poverty") // value to grab for event listener
      .attr("x", 0)
      .attr("y", 60)
      // .attr("dx", "1em")
      .classed("inactive", true)
      .text("In Poverty (%)");
    var incomeLabel = xlabelsGroup
      .append("text")
      .attr("value", "income") // value to grab for event listener
      .attr("x", 0)
      .attr("y", 80)
      // .attr("dx", "1em")
      .classed("inactive", true)
      .text("Household Income (Median)");

    //Create group labels for y-axis
    var ylabelsGroup = chartGroup.append("g").classed("aText", true);
    var obeseLabel = ylabelsGroup
      .append("text")
      .attr("value", "obesity") // value to grab for event listener
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -80)
      // .attr("dy", "1em")
      .classed("active", true)
      .text("Obese (%)");
    var smokeLabel = ylabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -60)
      // .attr("dy", "2.5em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
    var healthLabel = ylabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -40)
      // .attr("dy", "4em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");

    //Initial Tooltips
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
    // x axis labels event listener
    xlabelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        // console.log(chosenXAxis);
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(cenData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

        // updates circles text with new x values
        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

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
      }
    });
    // x axis labels event listener
    ylabelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        // replaces chosenXAxis with value
        chosenYAxis = value;
        // console.log(chosenYAxis);
        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(cenData, chosenYAxis);
        // console.log(yLinearScale);
        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

        // updates circles text with new y values
        circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
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
          healthLabel.classed("active", true).classed("inactive", false);
        }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
