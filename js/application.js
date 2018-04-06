var game = new GameManager();

const Directions = {
  up: 3,
  right: 2,
  down: 1,
  left: 0
}

var board = game.serialize().grid.cells

//board = Array.prototype.concat(...board) FOR ONLY ONE ARRAY

var str = ""

board.forEach(row => {
  str += row.map(cell => cell == null ? 0 : cell.value) + "\n"
});

console.log(str)

game.move(0)



/**
 * 
 * Given the different presentation of this fork,
 * these are the new moves:
 * 
 * 0 - LEFT
 * 1 - DOWN
 * 2 - RIGHT
 * 3 - UP
 */

board = game.serialize().grid.cells
str = ""

board.forEach(row => {
  str += row.map(cell => cell == null ? 0 : cell.value) + "\n"
});

console.log(str)
console.log(game.serialize().over)
console.log(game.serialize().won)