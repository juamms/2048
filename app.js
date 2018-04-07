const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const app = express()

app.use(express.static('public'))

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

wsServer.on('connection', (ws, req) => {
    let player = url.parse(req.url, true).query.player

    if (!player) {
        let err = 'No player specified.'

        console.log('ERROR: ' + err)
        ws.close(4000, err)

        return
    }

    console.log('New connection from player', player)

    ws.send('Hello ' + player + '!')

    ws.on('message', (message) => {
        console.log("Received message: %s", message)
    })

    ws.on('close', () => {
        console.log('Closing player %s.', player)
    })
})

server.listen(8080, () => {
    console.log('Listening on port %d', server.address().port)
})


// const GameManager = require('./models/game_manager')
// var game = new GameManager();

// const Directions = {
//   up: 3,
//   right: 2,
//   down: 1,
//   left: 0
// }

// var board = game.serialize().grid.cells

// //board = Array.prototype.concat(...board) FOR ONLY ONE ARRAY

// var str = ""

// board.forEach(row => {
//   str += row.map(cell => cell == null ? 0 : cell.value) + "\n"
// });

// console.log(str)

// game.move(0)



// /**
//  * 
//  * Given the different presentation of this fork,
//  * these are the new moves:
//  * 
//  * 0 - LEFT
//  * 1 - DOWN
//  * 2 - RIGHT
//  * 3 - UP
//  */

// board = game.serialize().grid.cells
// str = ""

// board.forEach(row => {
//   str += row.map(cell => cell == null ? 0 : cell.value) + "\n"
// });

// console.log(str)
// console.log(game.serialize().over)
// console.log(game.serialize().won)