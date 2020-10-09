# U.S. Census Data Analysis for Metro Journal

![Census](https://media.giphy.com/media/J4hPdgeczZyTlMTASs/giphy.gif)

## Background

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml)

#### Interactive Scatter Chart Analysis 
![7-animated-scatter](Images/7-animated-scatter.gif)

#### 1. Utilize d3 functionality 
Code scatterplot graphic `app.js` to pull data from `data.csv` by using the `d3.csv` function. Includes the state abbreviations within the circles. Axes are classically situated to the left and bottom of the chart. Visualizations can run using  `python -m http.server` to host the page at `localhost:8000` in your web browser.

#### 2. Add Dynamics

Include user-interactivity to click axes label to compare key metrics being analyzed. 

#### 2. Incorporate d3-tip

Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to state circles and display each tooltip with the data that the user has selected. Utilized `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)

* Check out [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how you should implement tooltips with d3-tip.

