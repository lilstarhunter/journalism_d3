var svgWidth = 1000;
var svgHeight = 560;
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart");

d3.csv("assets/data/data.csv").then(function (data) {
  data.forEach(function (d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });
  console.log(data);
  // create scales
  var xTimeScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.poverty))
    .range([0, width]);
  var yLinearScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.healthcare))
    .range([height, 0]);
  // create axes
  var xAxis = d3.axisBottom(xTimeScale);
  var yAxis = d3.axisLeft(yLinearScale);
  // append axes
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  chartGroup.append("g").call(yAxis);

  //Create a circles group
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xTimeScale(d.poverty))
    .attr("cy", (d) => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("stroke-width", "1")
    .attr("class", "stateCircle");

  var circleLabels = chartGroup
    .selectAll(null)
    .data(data)
    .enter()
    .append("text");

  circleLabels
    .attr("x", function (d) {
      return xTimeScale(d.poverty);
    })
    .attr("y", function (d) {
      return yLinearScale(d.healthcare - 0.25);
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText");

  //   chartGroup.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .attr("x", d => xTimeScale(d.poverty))
  //   .attr("y", d => yLinearScale(d.healthcare))
  chartGroup
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xTimeScale(d.poverty))
    .attr("y", (d) => yLinearScale(d.healthcare));

  // Add state labels to the points

  chartGroup
    .append("text")
    .attr("transform", `translate(500, 500)`)
    .attr("class", "aText")
    .text("Poverty (%)");
  chartGroup
    .append("text")
    .attr("transform", `translate(-35, 200)rotate(270)`)
    .attr("class", "aText")
    .text("Lacks HealthCare (%)");
});
