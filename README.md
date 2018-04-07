# 2048-server
This is a fork of Gabriele Cirulli's [2048](https://github.com/gabrielecirulli/2048) that works as a game server. The purpose of this project is to provide a common game logic and interface for different client-side game playing algorithm implementations, as part of a challenge competition between a couple of friends and me.

## Changes form the original
Most of the original gameplay rules for this fork have been kept. However, some limitations have been added for the purpose of the challenge:
* The game is finished as soon as the player hits 2048, with no option of continuing.
* Total moves are tracked and increased everytime a move is submitted to the server, even if it results in the grid not moving.
* Best highscore is no longer tracked and saved.
* No data is saved on local storage and is reset everytime the server is restarted.
* All UI related stuff is gone and the code has been adapted to work on the server.

## Challenge rules
* All clients will play a previously set amount of games.
* The main goal is to have the __most games won__ out of all that have been played.
* If multiple clients have the same amount of games won, the tie breaker is the total number of moves for all winning games, in which the client with the __least amount of moves__ wins.
* If all previous goals are equal, then the player with the __greatest overall score__ for all winning games wins.
* Implementing algorithms that were previously implemented or discovered elsewhere is __strictly forbidden__, as this challenge's main attraction is to come up with an algorithm of your own.

## API
__NOTE__: All client-server communication is done through `WebSocket`s.  

### Connecting
* URL: `ws://<your-server-ip>:8080?player=<your-player-id>`
* The `player` parameter is __required__. If it's not set, the server will close the connection with error `4000 No player specified`.
* Connecting to the server will automatically create a new game for the given `player`.
* The port can be changed in the source code, but it's not editable or exposed elsewhere.

### Moving the grid
To move the grid, send one of these commands as text:
* `^` or `up`: moves the grid up
* `>` or `right`: moves the grid right
* `v` or `down`: moves the grid down
* `<` or `left`: moves the grid left

### New game
* `+` or `new`: Will reset the current grid. The previous game will count toward the total number of games played.

### Server replies
To every command, the server will reply the following:
* `<score>|<moves>|<over>|<won>|<grid>`
  * `score` is the total score after the move you played.
  * `moves` is the total moves played after the previous move. Note that the move number is increased even if the previous move resulted in no grid changes.
  * `over` is a flag that is set when there are no more moves available.
  * `won` is a flag that is set if the game reached 2048.
  * `grid` is a comma delimited representation of the grid values.
* Here's an example of a server reply:
  * `60|27|false|false|16,4,0,0,4,4,0,0,4,4,0,0,0,0,0,0,`
  * Score: 60
  * Moves: 27
  * Game over: false
  * Game won: false
  * Grid:

        16 4 0 0
        4  4 0 0
        4  4 0 0
        0  0 0 0

* Upon connecting, the server will reply with a greeting message as a way to confirm that everything is okay.
* Every unknown command is ignored by the server, but the server will still use the reply above.

## Contributing
This project was made for fun and for the aforementioned challenge. Feel free to use it or fork it, though I probably won't be accepting or expecting contributions for it.

## License
2048 is licensed under the [MIT license.](https://github.com/juamms/2048/blob/master/LICENSE.txt)
