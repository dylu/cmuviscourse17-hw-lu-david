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
    console.log("teamData");
    console.log(teamData);
    createTable();
    updateTable();
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
    
    tableElements = teamData;


    // var scoreTable = svg.select("#matchTable").selectAll("tr").data(teamData);

    // scoreTable = scoreTable.enter()
    //     .append("tr")
    //     .merge(bars);



    // ******* TODO: PART V (Extra Credit) *******

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
        .data(teamData)
        .enter()
        .append("tr");
        // .merge(tableRows);

    // tableRows.exit().remove();

    var tableElements = 
        tableRows.selectAll("td")
        // d3.select("#matchTable").select("tbody").selectAll("tr").selectAll("td")
        .data(function(d) {
            // console.log(d);
            // console.log(d.value["Goals Made"]);
            // return d.value["Goals Made"];
            // return d;

            var cellData = new Object();
            cellData.type = d.value["type"];
            cellData.vis = "goals";
            // cellData.value = "howtf";
            cellData.value = Math.floor(Math.random() * 101);

            // console.log(cellData);

            // return cellData;

            return teamData.map(function(col){
                return {column: col, value: 2};
            });
        })
        .enter()
        .append("td")
        .text("2");
        // .merge(tableElements);

    // tableElements.exit().remove();

    // tableElements
        // .html(function(d) {
        //     return "hello";
        // })
        // .attr();
        // .text(function (d) {
        //     return "hello";
        // })
        ;
        // .enter()
        // .append("tr")
        // .selectAll("td")
        // .data(function(d) {
        //     console.log("Hello");
        // });

    console.log("--------------------------------------");
    // console.log("TR");
    // console.log(tableRows);
    // console.log("TD");
    // console.log(tableElements);

    console.log("d3.selectAll(\"td\")");
    console.log(d3.selectAll("td").filter(function(d){
        return true;
    }));


    // var bars = svg.select("#bars").selectAll("rect").data(allWorldCupData);

    // bars = bars.enter()
    //     .append("rect")
    //     .merge(bars);

    // bars.exit().remove();


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
