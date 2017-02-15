// Global var for FIFA world cup data
var allWorldCupData;
var selectedYear = 0;

/**
 * Helper function to capitalize words. (Purely for aesthetics.)
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension)
{
    // header changes based on window size, so hard coding for now.
    //var headerOffset = d3.select("header").node().getBoundingClientRect().height;
    var headerOffset = 120;     // header is 120px.
    var trans_dur = 1200;       // transition duration in ms.

    // Temporary (?) offset (x value) for details tab.
    var detailsXOffset = d3.select("#details").node().getBoundingClientRect().width;

    var height = 480;
    var width = 600;
    var svg = d3.select("svg");
    svg.attr("width", width)
        .attr("height", height);

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 60,
        yAxisHeight = 36;

    // padding size between bars.
    // chartWidth prevents cutting off on the far right.
    var xPadding = 2;
    var yPadding = 10;
    var chartWidth = svgBounds.width * 45/46;
    var chartHeight = svgBounds.height * 24/25;
    var textHeight = 10;

    // Create the x and y scales
    var minXval = d3.min(allWorldCupData, function(d){ return d.year; });
    var maxXval = d3.max(allWorldCupData, function(d){ return d.year; });
    var minYval = d3.min(allWorldCupData, function(d){ return d[selectedDimension]; });
    var maxYval = d3.max(allWorldCupData, function(d){ return d[selectedDimension]; });

    var years = [];
    allWorldCupData.forEach(function (d) {
        years.push(d.year);
    });
    years.sort();   // sorting by year, low->high.

    var xScale = d3.scaleBand()
        .domain(years)
        .range([xAxisWidth, chartWidth])
        .paddingInner(0.1)
        .paddingOuter(0.12);

    var yScale = d3.scaleLinear()
        .domain([0, maxYval])
        .range([chartHeight - yAxisHeight, yPadding]).nice();

    // Create colorScale
    var colorScale = d3.scaleLinear()
        .domain([0, maxYval])
        .range(["#90CAF9", "#1565C0"]);     // Blue 200 - 800

    // Hover Interaction.
    var hover_colorScale = d3.scaleLinear()
        .domain([0, maxYval])
        .range(["#80DEEA", "#00838F"]);     // Cyan 200 - 800

    // Create the axes (hint: use #xAxis and #yAxis)
    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);//.ticks(20);

    var yAxis = d3.axisLeft();
    yAxis.scale(yScale);

    svg.select("#xAxis")
        .transition()
        .duration(trans_dur)
        .attr("transform", "translate(" + 0 + "," + (chartHeight - yAxisHeight) + ")")
        .call(xAxis)
      .selectAll("text")
        .attr("y", -5)
        .attr("x", -28)
        .attr("transform", "rotate(-90)");

    svg.select("#yAxis")
        .transition()
        .duration(trans_dur)
        .attr("transform", "translate(" + xAxisWidth + "," + (0) + ")")
        .call(yAxis);

    // Create the bars (hint: use #bars)
    var bars = svg.select("#bars").selectAll("rect").data(allWorldCupData);

    bars = bars.enter()
        .append("rect")
        .merge(bars);

    bars.exit().remove();

    bars.transition()
        .duration(trans_dur)
        .attr("x", function(d) {
            return xScale(d.year);
        })
        .attr("y", function(d, i) {
            return yScale(d[selectedDimension]);
        })
        .attr("width", function (d) {
            return ((chartWidth - xAxisWidth) / allWorldCupData.length) - xPadding;
        })
        .attr("height", function (d) {
            return (chartHeight - yAxisHeight) - yScale(d[selectedDimension]);
        })
        .style("fill", function(d) {
            return colorScale(d[selectedDimension]);
        });

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Output the selected bar to the console using console.log()

    // Change color of bar being hovered over.
    bars.on('mouseover', function(d) {
            // No transition time on mouseover, to preserve responsiveness.
            var nodeSelection = d3.select(this)
                .filter(function(d, i) {
                    // Filtering 'selected' value to not change.
                    return (!d3.select(this).classed("selected"));
                })
                .style("fill", function(d) {
                return hover_colorScale(d[selectedDimension]);
            });

            d3.select("#bars_tooltip").classed("hidden", false);
        })
        // Tooltip follows mouse.
        .on('mousemove', function(d) {
            var curr_loc = d3.mouse(this);

            // fine tuning
            // var xAdj = 20 + detailsXOffset;
            // var yAdj = 32 + headerOffset;
            var xAdj = 10;
            var yAdj = -2;
            
            var tt = d3.select("#bars_tooltip")
                .style("left", (curr_loc[0] + xAdj) + "px")
                .style("top", (curr_loc[1] + yAdj) + "px");

            tt.select("#title")
                .text(capitalize([selectedDimension].toString()) + 
                    " " + d.year + ":");
            tt.select("#value")
                .text(d[selectedDimension]);

            tt.classed("hidden", false);
        })
        // Original bar color restored.
        .on('mouseout', function(d) {
            var nodeSelection = d3.select(this)
                .filter(function(d, i) {
                    // Filtering 'selected' value to not change.
                    return (!d3.select(this).classed("selected"));
                })
                .transition().duration(trans_dur/4)
                .style("fill", function(d) {
                return colorScale(d[selectedDimension]);
            });
            
            d3.select("#bars_tooltip").classed("hidden", true);
        })
        // Log + Display selected bar data.
        .on('click', function(d) {

            // Reset old 'selected' value.
            d3.selectAll(".selected")
                .transition()
                .duration(trans_dur/4)
                .style("fill", function(d) {
                    return colorScale(d[selectedDimension]);
                });
            d3.selectAll(".selected").classed("selected", false);

            // selectedYear = d.year;
            updateInfo(d);
            clearMap();
            updateMap(d);

            var nodeSelection = d3.select(this);

            nodeSelection
                .transition().duration(trans_dur/16)
                .style("fill", "#CCC")
                .on("end", function() {
                    d3.select(this)
                    .transition().duration(trans_dur/4)
                    .style("fill", "#5E35B1");
                });
            
            nodeSelection.classed("selected", true);

            // Outputting selection to selectionText.
            d3.select("#selectionText").html(
                    "<b>" + 
                    capitalize([selectedDimension].toString()) + ", " +
                    d.year + 
                    "</b> : &nbsp; " +
                    d[selectedDimension]);

            d3.select("#selectionTitle").classed("hidden", false);
            d3.select("#selectionText").classed("hidden", false);

            // Outputting selection to console.
            console.log("Selected the " + d.year + " value for " + 
                [selectedDimension] + ", " + d[selectedDimension]);
        });
}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData()
{

    // ******* TODO: PART I *******
    // Copy over your HW2 code here
    updateBarChart(d3.select("#dataset").node().value);

    d3.select("#selectionTitle").classed("hidden", true);
    d3.select("#selectionText").classed("hidden", true);
}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART II *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    // console.log(oneWorldCup);
    d3.select("#host")
        .html(oneWorldCup.host);

    d3.select("#winner")
        .html(oneWorldCup.winner);

    d3.select("#silver")
        .html(oneWorldCup.runner_up);

    d3.select("#teams")
        .html("")           // reset the html first.
        .append("ul")
        .selectAll("li")
        .data(oneWorldCup.teams_names)
        .enter()
        .append("li")
        .text(function(d) {
            return d;
        });
}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    // ******* TODO: PART III *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

    // var bars = svg.select("#bars").selectAll("rect").data(allWorldCupData);

    var map = d3.select("#map");

    // map.append("path")
    //     .datum(topojson.feature(world, world.objects.subunits))
    //     .attr("d", d3.geo.path().projection(projection));
    // console.log(world);

    var path = d3.geoPath().projection(projection);

    map.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) {
            d.id;
        })
        .classed("countries", true);

    // console.log(allWorldCupData);
    // console.log(world);

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)


}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART IV*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

    d3.select("#map").selectAll("path")
        .classed("host", false)
        .classed("team", false)
        .classed("gold", false)
        .classed("silver", false)
        .classed("countries", true);

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    console.log(worldcupData);

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART IV *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.

    // var win_loc;
    //     win_loc.lon = +worldcupData.WIN_LON;
    //     win_loc.lat = +worldcupData.WIN_LAT;

    // var rup_loc;
    //     rup_loc.lon = +worldcupData.RUP_LON;
    //     rup_loc.lat = +worldcupData.RUP_LAT;

    // var loc_data = [win_loc, rup_loc];

    var win_loc = [+worldcupData.WIN_LON, +worldcupData.WIN_LAT];
    var rup_loc = [+worldcupData.RUP_LON, +worldcupData.RUP_LAT];

    // console.log("Win Location = " + win_loc);
    // console.log("Rup Location = " + rup_loc);
    // console.log("Location Data = " + loc_data);

    var map = d3.select("#map");

    map.selectAll("path")
        .classed("host", function(d)
        {
            if (d.id == worldcupData.host_country_code)
            {
                return true;
            }
            return false;
        })
        .classed("team", function(d)
        {
            if (worldcupData.TEAM_LIST.includes(d.id))
            {
                return true;
            }
            return false;
        });

    // Remove all previous circles.
    map.selectAll("circle").remove();

    map.selectAll("circle")
        .data([win_loc, rup_loc])
        .enter()
        .append("circle")
        // .attr("name", worldcupData.winner)
        .attr("cx", function(d) {
            return projection(d)[0];
        })
        .attr("cy", function(d) {
            return projection(d)[1];
        })
        .attr("r", "6px")
        .classed("gold", function(d) {
            // console.log("hello");
            // console.log(d);
            return d == win_loc;
        })
        .classed("silver", function(d) {
            return d == rup_loc;
        });


        // .selectAll("path")
        // .data(topojson.feature(world, world.objects.countries).features)
        // .enter()
        // .append("path")
        // .attr("d", path)
        // .attr("id", function(d) {
        //     d.id;
        // })
        // .classed("countries", true);

        // <circle class="gold" cx="176" cy="12" r="8"></circle>
        // <text x="188" y="18">Winner</text>
        // <circle class="silver" cx="258" cy="12" r="8"></circle>
        // <text x="270" y="18">Runner-Up</text>

}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

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
