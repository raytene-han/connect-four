"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(width, height) {
  let row = [];

  for (let i = 0; i < width; i++) {
    row.push(null);
  }

  for (let i = 0; i < height; i++) {
    board.push(row);
  }

  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  // create variable to store top row
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // iterate over the number of columns and assign the column # "x" as
  // the id for the column
  // the id's are appended to the htmlBoard variable for the top row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      // you'll use this later, so make sure you use y-x
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  // iterate over rows y and check if board[y][x] is null. return y at the first null
  for (let y = HEIGHT - 1; y >= 0 ; y--) {
    if (!board[y][x]) {
      return y;
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let td = document.getElementById(`${y}-${x}`);
  let piece = document.createElement("div");

  piece.setAttribute("class", `piece p${currPlayer}`);
  td.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
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
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(piece=> piece))){
    return endGame("Tie Game");

  }


  // switch players
  (currPlayer === 1) ? currPlayer = 2 : currPlayer = 1;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // filters out cells not within game board dimensions
    // iterates over legalCells to check if all cells match current player

    let legalCells = cells.filter(([y, x]) =>
        y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH);

    if (legalCells.length === 4) {
      for (let [y, x] of legalCells) {
        let piece = document.getElementById(`${y}-${x}`);
        let count = 0;
        if (piece.classList.contains(`p${currPlayer}`)) {
          count++;
        }
      }
      return count === 4;
    } else {
      return false;
    }

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDR = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
