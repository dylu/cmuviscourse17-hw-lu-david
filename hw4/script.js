/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

var goalsMax = 0;

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

var aggregateMax = 0;

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    tableElements = data;

    console.log("data | teamData | tableElements");
    console.log(data);
    // console.log(teamData);
    // console.log(tableElements);

    // Could have just put '18,' but this is better in case data changes.
    teamData.forEach(function(dataElement) {
        goalsMax = Math.max(goalsMax, dataElement.value["Goals Conceded"]);
        goalsMax = Math.max(goalsMax, dataElement.value["Goals Made"]);
    });

    goalScale = d3.scaleLinear()
        .domain([0, goalsMax])
        .range([cellBuffer, 2 * cellWidth - cellBuffer]);

    createTable();
    // updateTable();
})

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable()
{
    // ******* TODO: PART II *******

    var xAxis = d3.axisTop();
    xAxis.scale(goalScale);//.ticks(20);

    d3.select("#goalHeader")
        .append("svg")
        .attr("width", 2*cellWidth)
        .attr("height", cellHeight)
        .append("g")
        .attr("transform", "translate(0, "+ (cellHeight-4) +")")
        .call(xAxis);


    // ******* TODO: PART V (Extra Credit) *******



    // Ensuring synchronous calls.
    updateTable();
}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable()
{
    // ******* TODO: PART III *******

    console.log("tableElements: ");
    console.log(tableElements);

    console.log("teamData");
    console.log(teamData);

    var scoreTable = d3.select("#matchTable").select("tbody");

    var tableRows = 
        scoreTable.selectAll("tr")
        .data(tableElements)
        .enter()
        .append("tr");

    tableRows.exit().remove();

    var teamNameData, goalData, roundData, winData, lossData, totalData;
    var goalSubData;

    var tableCells = 
        tableRows.selectAll("td")
        .data(function(d) {

            teamNameData = new Object();
            teamNameData.type = d.value["type"];    // aggregate?
            teamNameData.vis = "text";
            teamNameData.value = d.key;

            goalSubData = new Object();
            goalSubData.made = d.value["Goals Made"];
            goalSubData.conceded = d.value["Goals Conceded"];
            goalSubData.delta = d.value["Delta Goals"];

            goalData = new Object();
            goalData.type = d.value["type"];
            goalData.vis = "goals";
            goalData.value = goalSubData;

            roundData = new Object();
            roundData.type = d.value["type"];
            roundData.vis = "text";
            roundData.value = d.value.Result.label;

            winData = new Object();
            winData.type = d.value["type"];
            winData.vis = "bar";
            winData.value = d.value.Wins;

            lossData = new Object();
            lossData.type = d.value["type"];
            lossData.vis = "bar";
            lossData.value = d.value.Losses;

            totalData = new Object();
            totalData.type = d.value["type"];
            totalData.vis = "bar";
            totalData.value = d.value.TotalGames;

            /* Maximum value cannot be more than total Value, since 
             * Total Value = Win Value + Lose Value. */

            // aggregateMax = Math.max(aggregateMax, winData.value);
            // aggregateMax = Math.max(aggregateMax, lossData.value);
            aggregateMax = Math.max(aggregateMax, totalData.value);

            return [teamNameData, goalData, roundData, 
                    winData, lossData, totalData];
        })
        .enter()
        .append("td");

    tableCells.exit().remove();

    // Text Cells | Team, Round/Result.
    tableCells.filter(function(d) {
            return d.vis == 'text';
        })
        .text(function(d) {
            if (d.type != 'aggregate')
            {
                return "x" + d.value;
            }
            return d.value;
        });


    // Goal Cells | Goals
    tableCells.filter(function(d) {
            return d.vis == "goals";
        })
        // .text("goal cell");
        .append("svg")
        .attr("width", cellWidth*2)
        .attr("height", cellHeight)
        .append("g")
        .append("rect")
        .attr("x", function(d) {
            return goalScale(Math.min(d.value.made, d.value.conceded));
        })
        .attr("y", function(d) {
            if (d.type == 'aggregate')
                return barHeight/6;
            else
                return barHeight/3;
        })
        .attr("width", function (d) {
            if (d.value.delta == 0)
            {
                return 0;
            }
            return goalScale(Math.abs(d.value.delta)-2);
        })
        .attr("height", function(d) {
            if (d.type == 'aggregate')
                return barHeight*13/18;
            else
                return barHeight/3;
        })
        .style("fill", function(d) {
            // console.log("d.value");
            // console.log(d.value);
            // console.log(aggregateColorScale(d.value/aggregateMax));
            if (d.type == 'aggregate')
            {
                return goalColorScale(d.value.delta);
            }
            else
            {
                return "black";
            }
        })
        .classed("goalBar", true);

    tableCells.filter(function(d) {
            return d.vis == "goals";
        })
        .selectAll("g")
        .append("circle")
        .attr("cx", function (d) {
            return goalScale(d.value.made);
        })
        .attr("cy", barHeight/2 + barHeight/36)
        .attr("r", barHeight*13/36)
        .style("fill", function(d) {
            if (d.value.delta == 0)
            {
                return "grey";
            }
            return "blue";
        });

    tableCells.filter(function(d) {
            return d.vis == "goals";
        })
        .selectAll("g")
        .append("circle")
        .attr("cx", function (d) {
            return goalScale(d.value.conceded);
        })
        .attr("cy", barHeight/2 + barHeight/36)
        .attr("r", barHeight*13/36)
        .style("fill", function(d) {
            if (d.value.delta == 0)
            {
                return "grey";
            }
            return "red";
        });


    // Bar Cells | Wins, Losses, Total Games.
    tableCells.filter(function(d) {
            return d.vis == "bar";
        })
        // .text("bar cell")
        .append("svg")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .append("g")
        .append("rect")
        .attr("width", function (d) {
            return gameScale(d.value/aggregateMax);
        })
        .attr("height", barHeight)
        .style("fill", function(d) {
            return aggregateColorScale(d.value/aggregateMax);
        });

    tableCells.filter(function(d) {
            return d.vis == "bar";
        })
        .selectAll("svg")
        .append("text")
        .text(function(d) {
            if (d.value <= 1)
                return "";
            return d.value;
        })
        .attr("x", function(d) {
            return gameScale(d.value/aggregateMax);
        })
        .attr("y", cellHeight/2 + 4)
        .attr("dx", function(d) {
            // if (d.value <= 1)
            //     return "10px";
            return "-4px";
        })
        .attr("text-anchor", "end")
        .style("fill", function(d) {
            // if (d.value <= 1)
            //     return "grey";
            return "white";
        });


    // Clicking on a cell.
    tableRows
        .on('click', function(d, i) {
            if (d.value.type == 'aggregate')
            {
                updateList(i);
            }
            else
            {
                // Do Nothing
            }
        });


};


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******

    // console.log(i);

    var scoreTable = d3.select("#matchTable").select("tbody");
    var tableRows = scoreTable.selectAll("tr");

    // console.log(tableElements);

    // console.log(tableRows);
    // console.log(tableRows.data()[i]);
    if (tableRows.data().length <= i ||
        tableRows.data()[i+1].value.type == "aggregate")
    {
        tableRows.data()[i].value.games.forEach(function(elem) {
            tableElements.splice(i, 0, elem);
        })
    }

    // console.log(tableElements);

    updateTable();
}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******


};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}
