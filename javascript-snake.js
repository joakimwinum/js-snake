/*!
 * JavaScript Snake
 *
 * This is an implementation of the classic snake game.
 *
 * This game has been ported from the PHP version of the game:
 * https://github.com/joakimwinum/php-snake
 *
 * LICENSE:
 * MIT License
 *
 * Copyright (c) 2019 Joakim Winum Lien
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Author: Joakim Winum Lien <joakim@winum.xyz>
 * License: https://opensource.org/licenses/mit-license.html MIT License
 * Version: 1.0.0
 * Repository: https://github.com/joakimwinum/javascript-snake
 */
function javascriptSnake() {
    class FpsEngine {
        constructor() {
            this._initialFps = 16;
            this._gameLoopDelay = null;
        }

        get gameTimeStart() {
            return this._gameTimeStart;
        }

        set gameTimeStart(value) {
            this._gameTimeStart = value;
        }

        get gameTimeEnd() {
            return this._gameTimeEnd;
        }

        set gameTimeEnd(value) {
            this._gameTimeEnd = value;
        }

        get sleep() {
            return this._sleep;
        }

        set sleep(value) {
            this._sleep = value;
        }

        get initialSleep() {
            return this._initialSleep;
        }

        set initialSleep(value) {
            this._initialSleep = value;
        }

        get fps() {
            return this._fps;
        }

        set fps(value) {
            this._fps = value;
        }

        get initialFps() {
            return this._initialFps;
        }

        set initialFps(value) {
            this._initialFps = value;
        }

        get diffConstant() {
            return this._diffConstant;
        }

        set diffConstant(value) {
            this._diffConstant = value;
        }

        get verticalDirection() {
            return this._verticalDirection;
        }

        set verticalDirection(value) {
            this._verticalDirection = value;
        }

        fpsSync() {
            this.initialSleep = parseInt(1000/this.initialFps);
            this._newDelay = this.gameTimeEnd - this.gameTimeStart;
            this._gameLoopDelay = parseInt( (this._gameLoopDelay + this._newDelay)/2 );
            this.sleep = Math.sqrt( Math.pow((this.initialSleep - this._gameLoopDelay), 2) );

            if (this.verticalDirection) {
                this.sleep = parseInt(this.sleep/this.diffConstant);
            }

            this.fps = parseInt( 1000/(this.sleep + this._gameLoopDelay) );
        }
    }

    /* init */

    fpsEngine = new FpsEngine();


    /* settings */

    var framesPerSecondHorizontal = 16;
    var diffConstant = .65;
    var playerMovingVertical = false;

    fpsEngine.initialFps = framesPerSecondHorizontal;
    fpsEngine.diffConstant = diffConstant;
    fpsEngine.verticalDirection = playerMovingVertical;

    var pointDot = [];

    var snakeSprite = "&";
    var rightPointingTriangleSprite = ">";

    /* global variables */

    var board_x= 80;
    var board_y= 24;
    var score = 0;
    var snakeLen = 0;
    var snakeOldLen = 0;
    var totalNumberOfFrames = 0;
    var increaseInterval = 1;
    var lockInput = 0;
    var globalGameTitle = snakeSprite+" JavaScript Snake "+rightPointingTriangleSprite;
    var key;
    var leftMargin = "&nbsp;";
    var screen = "";
    var blankBoard = null;
    var cachedBoard = null;
    var doIncreasePlayer = false;
    var updatePointDot = false;
    var devMode = false;
    var gameIsOver = false;
    var board = "";

    /* game setup (to be run once) */

    // create the background and frame wall
    var background = createBackground();
    var frameWall = createFrameWall();

    // draw the background and frame onto the board and store it in the draw cache
    var cacheDraw = true;
    draw([
        background,
        frameWall
    ]);

    // create the player
    var player = createPlayer();


    /* functions */

    /* create functions */

    function createPlayer() {
        var playerSprite = "&";
        return [
            { x: 40, y: 12, sprite: playerSprite },
            { x: 39, y: 12, sprite: playerSprite },
            { x: 38, y: 12, sprite: playerSprite }
        ];
    }

    function createFrameWall() {
        var frameWallArray = [];
        wallSprite = "#";

        for (let i = 0; i < board_x; i++) {
            for (let j = 0; j < board_y; j++) {
                if (i === 0 || i === (board_x - 1) || j === 0 || j === (board_y - 1)) {
                    // create the frame wall
                    frameWallArray.push({x: i, y: j, sprite: wallSprite});
                }
            }
        }

        return frameWallArray;
    }

    function createBackground() {
        var backgroundArray = [];
        var backgroundSprite = "&nbsp;";

        for (let i = 0; i < board_x; i++) {
            for (let j = 0; j < board_y; j++) {
                // create the background
                backgroundArray.push({x: i, y: j, sprite: backgroundSprite});
            }
        }

        return backgroundArray;
    }

    function draw(entities) {
        board = "";

        // create a blank board array if it is not already done
        if (cacheDraw) {
            // create the board array
            blankBoard = {};

            for(let j=0; j < board_y; j++) {
                for(let i=0; i < board_x; i++) {
                    blankBoard[""+i+","+j+""] = {sprite: '%'};
                }
            }
        }
        boardArray = cachedBoard || blankBoard;

        // draw all the entities onto the board array
        for (let i=0, entitiesCount=entities.length; i < entitiesCount; i++) {
            var entity = entities[i];
            if (!('x' in entity)) {
                for (let j=0, entityCount=entity.length; j < entityCount; j++) {
                    var coo = entity[j];
                    boardArray[""+coo.x+","+coo.y+""] = {sprite: coo.sprite};
                }
            } else {
                boardArray[""+entity.x+","+entity.y+""] = {sprite: entity.sprite};
            }
        }

        // store the current entities in the draw cache
        if (cacheDraw) {
            cachedBoard = [boardArray];
            cachedBoard = cachedBoard[0];
            cacheDraw = false;
        }

        // convert the board array to string
        for(let j=0; j < board_y; j++) {
            for(let i=0; i < board_x; i++) {
                // add margin on the left side of the board
                if (i === 0) {
                    board += leftMargin;
                }

                // draw the board array
                board += boardArray[""+i+","+j+""].sprite;

                // add a line break on end of each line
                if (i === (board_x-1)) {
                    board += "<br>";
                }
            }
        }

        // return the board string
        return board;
    }

    /* other functions */

    function playerFunction(player) {
        snakeLen = player.length;
        var headDirection = null;
        var north = "north";
        var south = "south";
        var west = "west";
        var east = "east";

        // determine the direction of the players head
        if (player[0].x > player[1].x) {
            headDirection = east;
        } else if (player[0].x < player[1].x) {
            headDirection = west;
        } else if (player[0].y < player[1].y) {
            headDirection = north;
        } else if (player[0].y > player[1].y) {
            headDirection = south;
        }

        // move player with or without input
        if (key !== null) {
            if (key === "w" && (headDirection === west || headDirection === east)) {
                player = movePlayer(player, north);
            } else if (key === "a" && (headDirection === north || headDirection === south)) {
                player = movePlayer(player, west);
            } else if (key === "s" && (headDirection === west || headDirection === east)) {
                player = movePlayer(player, south);
            } else if (key === "d" && (headDirection === north || headDirection === south)) {
                player = movePlayer(player, east);
            }
        } else {
            player = movePlayer(player, headDirection);
        }

        return player;
    }

    function movePlayer(player, direction) {
        var north = "north";
        var south = "south";
        var west = "west";
        var east = "east";

        // take off the tail
        if (!increasePlayer()) {
            player.pop();
        }

        // create the new head
        var newHead = player[0];

        // move the new head
        if (direction === north) {
            newHead = { x: newHead.x, y: newHead.y-1, sprite: newHead.sprite };
            fpsEngine.verticalDirection = true;
        } else if (direction === west) {
            newHead = { x: newHead.x-1, y: newHead.y, sprite: newHead.sprite };
            fpsEngine.verticalDirection = false;
        } else if (direction === south) {
            newHead = { x: newHead.x, y: newHead.y+1, sprite: newHead.sprite };
            fpsEngine.verticalDirection = true;
        } else if (direction === east) {
            newHead = { x: newHead.x+1, y: newHead.y, sprite: newHead.sprite };
            fpsEngine.verticalDirection = false;
        }

        // add the new head on
        player = [newHead].concat(player);

        return player;
    }

    function increasePlayer(set = false, length = null) {
        score = (snakeLen-3);

        increaseInterval = length || increaseInterval;

        if (set) {
            snakeOldLen = snakeLen;
        }

        if (snakeLen >= (snakeOldLen+increaseInterval)) {
            doIncreasePlayer = false;
        } else {
            doIncreasePlayer = true;
        }

        return doIncreasePlayer;
    }

    function collisionTesting(player, pointDot) {
        // players head
        var playerHead = player[0];

        // check for collision with wall
        for (let i=0, frameWallCount=frameWall.length; i < frameWallCount; i++) {
            var wall = frameWall[i];
            if(wall.x === playerHead.x && wall.y === playerHead.y) {
                gameOver();
            }
        }

        // player eats point dot
        if (playerHead.x === pointDot[0].x && playerHead.y === pointDot[0].y) {
            increasePlayer(true);
            updatePointDot = true;
        }

        // check if player head touches its own tail
        for (let i=0, playerCount=player.length; i < playerCount; i++) {
            var part = player[i];
            if (i === 0) {
                // skip head
                continue;
            }
            if (playerHead.x === part.x && playerHead.y === part.y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        screen = leftMargin;
        screen += globalGameTitle;
        screen += " Game Over ";
        padScore = ("0000"+score).slice(-4);
        rightPointingTriangleSprite = ">";
        screen += rightPointingTriangleSprite;
        screen += " Score: "+padScore;
        if (devMode) {
            screen += " [DevMode]";
        }
        screen += "<br>";
        screen += board;

        // clear the screen and print the screen
        document.getElementById('javascript-snake-frame').innerHTML = screen;

        // display the score in the console
        var consoleLog = "JavaScript Snake Score: "+padScore;
        consoleLog = devMode ? consoleLog+" [DevMode]" : consoleLog;
        console.log(consoleLog);

        gameIsOver = true;
    }

    function generateNewCoordinates(pointDot, player) {
        whileLoop:
            while (true) {
                // get random coordinates
                rand_x = Math.floor(Math.random() * (board_x - 2)) + 1;
                rand_y = Math.floor(Math.random() * (board_y - 2)) + 1;

                // check if the player already is on the new coordinates
                for (let i=0, playerCount=player.length; i < playerCount; i++) {
                    if (player[i].x === rand_x && player[i].y === rand_y) {
                        break whileLoop;
                    }
                }

                // check if the new coordinates are in the old place of the point dot
                if (pointDot.x === rand_x && pointDot.y === rand_y) {
                    continue;
                }

                break;
            }

        return [rand_x, rand_y];
    }

    function pointDotFunction(player, pointDot = []) {
        var pointDotSprite = "*";

        // generate the first dot
        if (pointDot.length === 0) {
            var coordinates = generateNewCoordinates([], player);
            pointDot = [{ x: coordinates[0], y: coordinates[1], sprite: pointDotSprite }];
        }

        // update the dot
        if (updatePointDot) {
            coordinates = generateNewCoordinates(pointDot, player);
            pointDot = [{ x: coordinates[0], y: coordinates[1], sprite: pointDotSprite }];
            updatePointDot = false;
        }

        return pointDot;
    }

    function printStats() {
        // add left margin
        var stats = leftMargin;

        // display game name
        stats += globalGameTitle;

        // display score
        padScore = ("0000"+score).slice(-4);
        stats += " points: "+padScore;

        // display extra stats in dev mode
        if (devMode) {
            // display snake length
            padSnakeLen = ("0000"+snakeLen).slice(-4);
            stats += ", length: "+padSnakeLen;

            // display total number of frames
            padFrames = ("0000"+totalNumberOfFrames).slice(-4);
            stats += ", total frames: "+padFrames;

            // display frames per second
            padFPS = ("0000"+fpsEngine.fps).slice(-4);
            stats += ", FPS: "+padFPS;
        }

        // add new line
        stats += "<br>";

        return stats;
    }

    function keyActions() {
        // do actions upon certain key presses
        if (key !== null) {
            if (key === "q") {
                // exit the game
                gameIsOver = true;
            } else if (key === "i") {
                // increase length
                if (devMode) {
                    increasePlayer(true, 40);
                }
            } else if (key === "u") {
                // increase length
                if (devMode) {
                    increasePlayer(true, 140);
                }
            } else if (key === "r") {
                // reset length increase
                if (devMode) {
                    increasePlayer(null, 1);
                }
            } else if (key === "e") {
                // increase fps
                if (devMode) {
                    fpsEngine.initialFps = 25;
                }
            } else if (key === "y") {
                // increase fps by 1 fps
                if (devMode) {
                    fpsEngine.initialFps += 1;
                }
            } else if (key === "n") {
                // replace point dot
                if (devMode) {
                    updatePointDot = true;
                }
            } else if (key === "t") {
                // activate dev mode
                if (!devMode) {
                    devMode = true;
                }
            }
        }
    }

    /* read key press */
    document.addEventListener('keydown', function(e) {
        if (lockInput !== 1) {
            switch(e.which) {
                case 87:
                    key = "w";
                    break;
                case 65:
                    key = "a";
                    break;
                case 83:
                    key = "s";
                    break;
                case 68:
                    key = "d";
                    break;
                case 81:
                    key = "q";
                    break;
                case 73:
                    key = "i";
                    break;
                case 85:
                    key = "u";
                    break;
                case 82:
                    key = "r";
                    break;
                case 69:
                    key = "e";
                    break;
                case 89:
                    key = "y";
                    break;
                case 78:
                    key = "n";
                    break;
                case 84:
                    key = "t";
                    break;
                default:
                    return;
            }
        } else {
            return;
        }
        e.preventDefault();
    });

    document.addEventListener('keyup', function(e) {
        lockInput = 1;
    });


    /* game loop */
    function gameLoop() {
        setTimeout(function () {
            // game time start
            fpsEngine.gameTimeStart = new Date().getTime();

            // add stats to the screen
            screen = printStats();

            // update the player
            player = playerFunction(player);

            // update the point dot
            pointDot = pointDotFunction(player, pointDot);

            // collision testing
            collisionTesting(player, pointDot);

            // draw the board with all the entities on it and add it to the screen
            board = draw([
                background,
                frameWall,
                pointDot,
                player
            ]);
            screen += board;

            // clear the screen and print the screen
            if (gameIsOver === false) {
                document.getElementById('javascript-snake-frame').innerHTML = screen;
            }

            // perform key actions
            keyActions();
            key = null;
            lockInput = 0;

            // count frames
            totalNumberOfFrames += 1;

            // game time end
            fpsEngine.gameTimeEnd = new Date().getTime();

            // sync game loop to the saved fps value
            fpsEngine.fpsSync();

            // handle game loop recursion
            if (gameIsOver === false) {
                gameLoop();
            }
        }, fpsEngine.sleep)
    }
    gameLoop(); // game loop init
}
javascriptSnake();
