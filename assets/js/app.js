// @TODO: YOUR CODE HERE! variable to define drawbox
var svgWidthdrawBox = 960;
var svgHeightdrawBox = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
var width = svgWidthdrawBox - margin.left - margin.right;
var height = svgHeightdrawBox - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidthdrawBox)
    .attr("height", svgHeightdrawBox);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
d3.csv("/assets/data/data.csv").then(function (data) {
    console.log(data);

    data.forEach(function (data1) {
        data1.poverty = +data1.poverty;
        data1.healthcare = +data1.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) - 2, d3.max(data, d => d.poverty) + 2])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) - 2, d3.max(data, d => d.healthcare) + 2])
        .range([height, 0]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("In Poverty");
    chartGroup.append("g")
        .call(leftAxis);
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare  %");

    //Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var circlesGroup = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size","10px")
        .style("fill", "white")
        .style("text-anchor", "middle")
        .text(d => (d.abbr));


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
        });

    chartGroup.call(toolTip);

    //create event listeners 
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);

    });
});


