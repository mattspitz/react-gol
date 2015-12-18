var classNames = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

var NUM_ROWS = 45;
var NUM_COLS = 90;
var INITIAL_FILL_PCT = 0.2;

var EMPTY = 1;
var FULL = 2;

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

var GameOfLife = React.createClass({
    getInitialState: function() {
        return {grid: initializeGrid()};
    },

    componentDidMount: function() {
        setInterval(() => {
            this.setState({
                grid: updateGrid(this.state.grid.slice(0))
            });
        }, 750);
    },

    render: function() {
        var rows = this.state.grid.map((row, index) => {
            return <Row key={index} cells={row} />;
        });
        return <div>{rows}</div>
    }
});

var Row = React.createClass({
    shouldComponentUpdate: function(nextProps) {
        return !_.isEqual(this.props.cells, nextProps.cells);
    },
    render: function() {
        var cells = this.props.cells.map((cell, index) => {
            return <Cell key={index} state={cell} />;
        });
        return <div className='row'>{cells}</div>;
    }
});

var Cell = React.createClass({
    shouldComponentUpdate: function(nextProps) {
        return this.props.state !== nextProps.state;
    },
    render: function() {
        var classes = classNames({
            cell: true,
            empty: this.props.state === EMPTY,
            full: this.props.state === FULL
        });
        return (
            <div className={classes}></div>
       )
    }
});

ReactDOM.render(
    <GameOfLife />,
    document.getElementById("container")
);
