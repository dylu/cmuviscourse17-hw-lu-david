// Global var for FIFA world cup data
var allWorldCupData;

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension)
{
    var temp = "d." + [selectedDimension];
    // var data = allWorldCupData;
    // var data = [30, 80, 10, 40, 120, 130, 20, 120, 820, 40, 20, 30];
    var height = 400;
    var width = 800;
    var svg = d3.select("svg");
    svg.attr("width", width)
        .attr("height", height);

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes

    console.log(temp);
    // console.log(d[selectedDimension]);

    // var minYear = d3.min(allWorldCupData, function(d){ return d.year; });
    // var maxYear = d3.max(allWorldCupData, function(d){ return d.year; });
    // var minAttendance = d3.max(allWorldCupData, function(d){ return d.attendance; });
    // var maxAttendance = d3.max(allWorldCupData, function(d){ return d.attendance; });
    var minXval = d3.min(allWorldCupData, function(d){ return d.year; });
    var maxXval = d3.max(allWorldCupData, function(d){ return d.year; });
    var minYval = d3.min(allWorldCupData, function(d){ return d[selectedDimension]; });
    var maxYval = d3.max(allWorldCupData, function(d){ return d[selectedDimension]; });

    var years = [];
    allWorldCupData.forEach(function (d) {
        years.push(d.year);
    })

    // var xScale = d3.scaleLinear()
    //     .domain([minYear, maxYear])
    //     .range([0, svgBounds.width]).nice();

    // console.log(allWorldCupData);

    //TODO:
    // d3.scaleBand();
    var xScale = d3.scaleBand()
        .domain(years)
        .range([0, svgBounds.width])
        .padding(0.1)
        .paddingInner(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, maxYval])
        .range([svgBounds.height, 0]).nice();

    // Create colorScale
    var colorScale = d3.scaleLinear()
        .domain([0, maxYval])
        .range(["lightgray", "black"]);

    // Create the axes (hint: use #xAxis and #yAxis)
    var xAxis = d3.axisBottom();
        xAxis.scale(xScale).ticks(20);

    // Create the bars (hint: use #bars)

    var bars = svg.select("#bars").selectAll("rect").data(allWorldCupData);

    bars = bars.enter()
        .append("rect")
        .merge(bars);

    bars.exit().remove();

    bars.attr("x", function(d) {
            return xScale(d.year);
        })
        .attr("y", function(d, i) {
            return yScale(eval(temp));
        })
        .attr("width", function (d) {
            return svgBounds.width / allWorldCupData.length;
        })
        .attr("height", function (d) {
            return svgBounds.height - yScale(eval(temp));
        })
        .style("fill", function(d) {
            return colorScale(eval(temp));
        });

    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Output the selected bar to the console using console.log()

}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.
    updateBarChart(d3.select("#dataset").node().value);
}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});
