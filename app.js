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
var activePlayers = []
var archiveData = {}
var dashboardSocket = null

function updateDashboard() {
    if (dashboardSocket != null) {
        let tempData = {}
        console.log(activePlayers)
        activePlayers.forEach(p => {
            tempData[p] = GameHelper.serializeGameData(data[p])
        });

        let currentData = {
            current: tempData,
            archive: archiveData
        }

        dashboardSocket.send(JSON.stringify(currentData))
    }
}

function setupDashboardUser(ws) {
    ws.on('close', () => {
        console.log('Disabling dashboard connection.')
        dashboardSocket = null
    })

    dashboardSocket = ws
    updateDashboard()
}

wsServer.on('connection', (ws, req) => {
    let player = url.parse(req.url, true).query.player

    if (!player) {
        let err = 'No player specified.'

        console.log('ERROR: ' + err)
        ws.close(4000, err)

        return
    }

    if (player == 'dashbaord') {
        console.log('New connection from dashboard.')
        setupDashboardUser(ws)

        return
    }

    console.log('New connection from player', player)

    ws.send('Hello ' + player + '!')

    data[player] = new GameManager()
    if (activePlayers.indexOf(player) == -1) {
        activePlayers.push(player)
    }

    ws.send(GameHelper.serializeGameData(data[player]))
    updateDashboard()

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
            console.log(GameHelper.serializeGameData(data[player]))

            if (!archiveData[player]) {
                archiveData[player] = []
            }

            let gameData = GameHelper.serializeGameData(data[player])
            if (archiveData[player].indexOf(gameData) == -1) {
                archiveData[player].push(gameData)
            }
        }

        ws.send(GameHelper.serializeGameData(data[player]))
        updateDashboard()
    })

    ws.on('close', () => {
        console.log('Deleting data for player %s.', player)

        activePlayers = activePlayers.filter(item => {
            return item != player
        })

        delete data[player]
    })
})

server.listen(8080, () => {
    console.log('Listening on port %d', server.address().port)
})