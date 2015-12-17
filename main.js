var NUM_ROWS = 45;
var NUM_COLS = 90;
var INITIAL_FILL_PCT = 0.2;

var EMPTY = 1;
var FULL = 2;

var GameOfLife = React.createClass({
    render: function() {
        var table = [];
        for (var r = 0; r < this.props.grid.length; r++) {
            var rowCells = [];
            var row = this.props.grid[r];
            for (var c = 0; c < row.length; c++) {
                var key = r + "x" + c;
                rowCells.push(<Cell key={key} state={row[c]}/>);
            }
            table.push(<div key={key} className="row">{rowCells}</div>)
        }
        return (
            <div>{table}</div>
        )
    }
});

var Cell = React.createClass({
    render: function() {
        // there has to be a better way to initialize this
        var stateClassMap = {};
        stateClassMap[EMPTY] = "empty";
        stateClassMap[FULL] = "full";

        var key = this.props.row + "x" + this.props.col;
        var classes = "cell " + stateClassMap[this.props.state];
        return (
            <div key={key} className={classes}></div>
       )
    }
});

function initializeGrid() {
    var grid = [];
    for (var r = 0; r < NUM_ROWS; r++) {
        grid.push([]);
        for (var c = 0; c < NUM_COLS; c++) {
            grid[r].push(Math.random() < INITIAL_FILL_PCT ? FULL : EMPTY);
        }
    }
    return grid;
}

function updateGrid(oldGrid) {
    var newGrid = [];
    for (var r = 0; r < NUM_ROWS; r++) {
        newGrid.push([]);
        for (var c = 0; c < NUM_COLS; c++) {
            var toCheck = [
                [r - 1, c - 1], // top-left
                [r - 1, c], // above
                [r - 1, c + 1], // top-right
                [r, c + 1], // right
                [r + 1, c + 1], // bottom-right
                [r + 1, c], // below
                [r + 1, c - 1], // bottom-left
                [r, c - 1], // left
            ];
            var numNeighbors = 0;
            for (var i = 0; i < toCheck.length; i++) {
                var checkRow = toCheck[i][0],
                    checkCol = toCheck[i][1];
                if ((checkRow >= 0 && checkRow < NUM_ROWS)
                        && (checkCol >=0 && checkCol < NUM_COLS)
                        && (oldGrid[checkRow][checkCol] == FULL)) {
                    numNeighbors += 1;
                }
            }

            if (oldGrid[r][c] == EMPTY) {
                if (numNeighbors != 3) {
                    newGrid[r][c] = EMPTY;
                } else {
                    newGrid[r][c] = FULL;
                }
            } else if (oldGrid[r][c] == FULL) {
                if (numNeighbors <= 1 || numNeighbors >= 4) {
                    newGrid[r][c] = EMPTY;
                } else {
                    newGrid[r][c] = FULL;
                }
            } else {
                console.log("Uh oh. Unknown state: " + oldGrid[r][c]);
            }
        }
    }
    return newGrid;
}

function main() {
    var gridHolder = [initializeGrid()];
    setInterval(function() {
        gridHolder[0] = updateGrid(gridHolder[0]);

        ReactDOM.render(
            <GameOfLife grid={gridHolder[0]} />,
            document.getElementById("container")
        );
    }, 750);
}

main();
