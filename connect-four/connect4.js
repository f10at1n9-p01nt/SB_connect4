/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
// const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

//? Would it be better to put this helper function in makeBoard()? How to write a good comment?
// Return array filled with val to requested length.
const arrayCreator = (length, val) => {
	arr = [];
	for (let i = 0; i < length; i++) {
		arr.push(val);
	}
	return arr;
};

// // TODO: set "board" to empty HEIGHT x WIDTH matrix array
function makeBoard() {
	const board = [];
	// Create row of null values the width of the game board
	const emptyValues = arrayCreator(WIDTH, null);
	for (let i = 0; i < HEIGHT; i++) {
		board.push([ ...emptyValues ]); // * Bug fix - make sure to create new copy
	}
	return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board'); // the table element
	// // TODO: add comment for this code
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	/* Creates cells to be clicked on in the top row with id from 0 to WIDTH-1
  // Note: columns count from top down */
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// // TODO: add comment for this code
	// Creates cells on game board WIDTH x HEIGHT with id: (col - row)
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// // TODO: write the real version of this, rather than always returning 0
	// Work from bottom to top in each column x and return row with first null.
	for (let row = board.length - 1; row > -1; row--) {
		if (board[row][x] === null) {
			return row;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// // TODO: make a div and insert into correct table cell
	// y is column and x is row
	const selectedCell = document.getElementById(y + '-' + x);
	const selectedCellDiv = document.createElement('div');

	selectedCellDiv.classList.add('piece', 'p' + currPlayer);
	selectedCell.append(selectedCellDiv);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// // TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// // TODO: check if all cells in board are filled; if so call, call endGame
	// Immediately Invoked
	// ? I could use similar log to the above function: have function return boolean
	// ? and run a conditional on the function. I kept the contrast so I could ask about the two approaches.
	(function checkAllFilled() {
		const tests = [];
		for (let row = 0; row < board.length; row++) {
			tests.push(board[row].every((player) => player !== null));
		}
		return tests.every((row) => row === true) ? endGame('No one wins. You both lose!') : undefined;
	})();

	// switch players
	// // TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	// ? Private method?
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		// Goes through each array in the passed in array of cells
		// Checks if y and x are valid
		// Checks if the player in the board for each cells is the same
		// If passes all checks, returns true
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	// Creates an array of 4 cells in different directions with every possible y, x inside the board dimensions
	// ? Could we have stopped the x and y variables sooner? Thus avoiding so many checks in _win()
	// * Answered my own question: No, because we need to check the last row for horizontal wins and the last column for vertical wins
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			// passes each array into the _win function
			// if any are true, we have a winner
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

const board = makeBoard();
makeHtmlBoard();
