// //=======Start with SINGLE GRAPH =====//
// //=========Create the SVG/Chart canvas=========//
// //Define SVG area dimensions
// var svgWidth = 900;
// var svgHeight = 900;

// //Define chart's margins as an object
// var chartMargin = {
//     top: 30,
//     right: 30,
//     bottom: 30,
//     left: 30,
//   };

// // Define dimensions of the chart area
// var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
// var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// // Select body, append SVG area to it, and set the dimensions
// var svg = d3
//   .select("body")
//   .append("svg")
//   .attr("height", svgHeight)
//   .attr("width", svgWidth);

// // Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// // to the margins set in the "chartMargin" object.
// var chartGroup = svg
// .append("g")
// .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// //=========Create Axes=========//
// // scale y to chart height
// var yScale = d3.scaleLinear()
//   .domain([0, d3.max(//Insert data//)])
//   .range([chartHeight, 0]);

// // scale x to chart width
// var xScale = d3.scaleBand()
//   .domain( //Insert data//)
//   .range([0, chartWidth])
//   .padding(0.05);

//Load CSV data file into d3 object
d3.csv("assets/data/data.csv").then(function(cenData){
    console.log(cenData);

    // log a list of names
    var state = cenData.map(data => data.abbr);
    console.log("State", state);
    var smokes = []
    var ages = []
    // Grab data values of interest convert to numeric
    cenData.forEach(function(data) {
      var smokers = (data.smokes = +data.smokes);
      smokes.push(smokers)
      var age = data.age = +data.age
      ages.push(age)
    //   console.log("State:", data.abbr)
    //   console.log("Percent Smokers:", smokes)
    //   console.log("Average Age:", age)
    });

    console.log(ages)
  }).catch(function(error) {
    console.log(error);
  });