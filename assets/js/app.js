//=========Define SVG Area and Margins=========//
//Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 600;

//Define chart's margins as an object
var margin = {
  top: 10,
  right: 60,
  bottom: 60,
  left: 80,
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
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart");

//======Set X Axes Functions ======//
//Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(cenData, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(cenData, (d) => d[chosenXAxis]) * 0.8,
      d3.max(cenData, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  //Returns the X axis no Label - ticks based on chosen X axis
  return xLinearScale;
}

//Create a function for chosen X Axis
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  //Create a transition
  xAxis.transition().duration(1000).call(bottomAxis);
  return xAxis;
}

// //======Set Y Axes Functions ======//
// //Initial Params
// var chosenYAxis = "obesity";

// // function used for updating y-scale var upon click on axis label
// function yScale(cenData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3
//     .scaleLinear()
//     .domain([
//       d3.min(cenData, (d) => d[chosenYAxis]),
//       d3.max(cenData, (d) => d[chosenYAxis]),
//     ])
//     .range([0, height]);

//   return yLinearScale;
// }

// function renderYScale(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   //Create a transition
//   yAxis.transition().duration(1000).call(leftAxis);
//   return yAxis;
// }

//Create a function to update the data points
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr(
      "cx",
      (d) => newXScale(d[chosenXAxis])
      // .text((d) => d.abbr)
      // .attr("class", "stateText")
    );

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;
  if (chosenXAxis === "age") {
    label = "Age (Median)";
  } else if (chosenXAxis === "poverty") {
    label = "In Poverty (%)";
  } else {
    label = "Household Income (Median)";
  }

  // var ylabel;
  // if (chosenYAxis === "obesity") {
  //   ylabel = "Obese (%)";
  // } else if (chosenYAxis === "smokes") {
  //   ylabel = "Smokes (%)";
  // } else {
  //   ylabel = "Lacks Healthcare (%)";
  // }

  //Hover over spot label
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return `${d.state}(${d.abbr})<br>${label}:  ${d[chosenXAxis]} <br> obesity(%):  ${d.obesity}`;
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
d3.csv("assets/data/data.csv")
  .then(function (cenData, err) {
    if (err) throw err;

    //parseData from string to integer
    cenData.forEach(function (data) {
      //y axis data
      data.obesity = +data.obesity;
      // data.smokes = +data.smokes;
      // data.healthcare = +data.healthcare;
      //x axis data
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.poverty = +data.income;
    });
    // console.log(cenData);
    //Create axes linear scale
    var xLinearScale = xScale(cenData, chosenXAxis);
    var yLinearScale = d3
      .scaleLinear()
      .domain([
        d3.min(cenData, (d) => d.obesity) - 2,
        d3.max(cenData, (d) => d.obesity) + 2,
      ])
      .range([height - 20, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    // append x axis
    var xAxis = chartGroup
      .append("g")
      // .classed("x-axis", true)
      .attr("transform", `translate(0, ${height - 20})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g").call(leftAxis);

    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(cenData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d.obesity))
      .attr("r", 10);

    //Create group labels for x-axis
    var labelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height})`)
      .classed("aText", true);

    var ageLabel = labelsGroup
      .append("text")
      .attr("value", "age") // value to grab for event listener
      .classed("active", true)
      .attr("x", 0)
      .attr("y", 10)
      .attr("dx", "1em")
      .text("Age (Median)");

    var povertyLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("dx", "1em")
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("In Poverty (%)");

    var incomeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 50)
      .attr("dx", "1em")
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // //Create group labels for y-axis
    // var labelsYGroup = chartGroup
    //   .append("g")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", height / 2)
    //   .attr("x", 0 - margin.left)
    //   .attr("dy", "1em")
    //   .classed("aText", true);

    // var obeseLabel = labelsYGroup
    //   .append("text")
    //   .attr("value", "obesity") // value to grab for event listener
    //   .classed("active", true)
    //   .text("Obese (%)");

    // var smokeLabel = labelsYGroup
    //   .append("text")
    //   .attr("x", 0)
    //   .attr("y", 20)
    //   .attr("value", "smokes") // value to grab for event listener
    //   .classed("inactive", true)
    //   .text("Smokes (%)");

    // var healthLabel = labelsYGroup
    //   .append("text")
    //   .attr("x", 0)
    //   .attr("y", 40)
    //   .attr("value", "healthcare") // value to grab for event listener
    //   .classed("inactive", true)
    //   .text("Lacks Healthcare (%)");

    // append y axis label
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .text("Obesity (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(cenData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
        // // changes classes to change bold text Y axis
        // if (chosenYAxis === "obesity") {
        //   obeseLabel.classed("active", true).classed("inactive", false);
        //   smokeLabel.classed("active", false).classed("inactive", true);
        //   healthLabel.classed("active", false).classed("inactive", true);
        // } else if (chosenYAxis === "smokes") {
        //   obeseLabel.classed("active", false).classed("inactive", true);
        //   smokeLabel.classed("active", true).classed("inactive", false);
        //   healthLabel.classed("active", false).classed("inactive", true);
        // } else {
        //   obeseLabel.classed("active", false).classed("inactive", true);
        //   smokeLabel.classed("active", false).classed("inactive", true);
        //   healthLabel.classed("active", true).classed("inactive", false);
        // }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
