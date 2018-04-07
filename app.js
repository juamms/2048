const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const app = express()
const GameManager = require('./models/game_manager')
const GameHelper = require('./models/game_helper')

app.use(express.static('public'))

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

var data = {}
var archiveData = {}

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

    data[player] = new GameManager()

    ws.send(GameHelper.serializeGameData(data[player]))

    ws.on('message', (message) => {
        console.log('Received message: %s', message)

        if (GameHelper.isNewGameRequest(message)) {
            console.log('Message is a new game request')

            // TODO: If there was a previous game, add it to the archived games

            data[player].restart()
        }

        let gameMove = GameHelper.normalizeMove(message)

        if (gameMove != null) {
            console.log('Message is a move request')
            data[player].move(gameMove)
        }

        if (data[player].isGameTerminated()) {
            console.log('Game is over!')
            consoler.log(GameHelper.serializeGameData(data[player]))

            if (!archiveData[player]) {
                archiveData[player] = []
            }

            archiveData[player].push(GameHelper.serializeGameData(data[player]))
        }

        ws.send(GameHelper.serializeGameData(data[player]))
    })

    ws.on('close', () => {
        console.log('Deleting data for player %s.', player)
        delete data[player]
    })
})

server.listen(8080, () => {
    console.log('Listening on port %d', server.address().port)
})