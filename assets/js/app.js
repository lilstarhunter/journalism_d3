//=======Start with SINGLE GRAPH =====//
//=========Define SVG Area and Margins=========//
//Define SVG area dimensions
var svgWidth = 500;
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


//Load CSV data file into d3 object
d3.csv("assets/data/data.csv").then(function(cenData){
    cenData.forEach(function (data) {
        data.smokes = +data.smokes;
        data.age = +data.age
      });

    var smokes = []
    var age = []
    var state = []
    for (i =0; i <cenData.length; i++){
        smokes.push(cenData[i].smokes)
        age.push(cenData[i].age)
        state.push(cenData[i].abbr)
      }
    
        //=========Create Axes=========//
        // scale y to chart height
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(smokes)])
            .range([chartHeight, 0]);
        svg.append("g").call(d3.axisLeft(yScale))
        
        // scale x to chart width
        var xScale = d3.scaleLinear()
        .domain([0, d3.max(age)])
        .range([0, chartWidth])
        .padding(0.05);
        svg.append("g").call(d3.axisBottom(xScale))
        
        //Add dots
        svg.append('g')
        .selectAll("dot")
        .data(cenData)
        .classed("stateCircle", true)
        .enter()
        .append("circle")
            .attr("cx", function (d,i) { return  xScale(d.age)})
            .attr("cy", function (d,i) {return yScale(d.smokes)})
            .attr("r", 5)
        
        });
    


