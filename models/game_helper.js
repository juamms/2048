function serializeGameData(game) {
    let data = game.serialize()
    let gridData = Array.prototype.concat(...data.grid.cells)
    let grid = ''

    gridData.forEach(cell => {
        grid += (cell == null ? 0 : cell.value) + ','
    });

    return '' + data.score + '|' + data.moves + '|' + data.over + '|' + data.won + '|' + grid
}

function isNewGameRequest(message) {
    switch (message.trim()) {
        case '+':
        case 'new':
            return true
        default:
            return false
    }
}

function normalizeMove(move) {
    let Directions = {
        up: 3,
        right: 2,
        down: 1,
        left: 0
    }

    switch (move.trim()) {
        case '^':
        case 'up':
            return Directions.up
        case '>':
        case 'right':
            return Directions.right
        case 'v':
        case 'down':
            return Directions.down
        case '<':
        case 'left':
            return Directions.left
        default:
            return null
    }
}

module.exports = {
    serializeGameData: serializeGameData,
    isNewGameRequest: isNewGameRequest,
    normalizeMove: normalizeMove
}