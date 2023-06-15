"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
var GRID_VALUE;
(function (GRID_VALUE) {
    GRID_VALUE[GRID_VALUE["EMPTY"] = 0] = "EMPTY";
    GRID_VALUE[GRID_VALUE["SNAKE"] = 1] = "SNAKE";
    GRID_VALUE[GRID_VALUE["FOOD"] = 2] = "FOOD";
})(GRID_VALUE || (GRID_VALUE = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["UP"] = 0] = "UP";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    DIRECTION[DIRECTION["DOWN"] = 2] = "DOWN";
    DIRECTION[DIRECTION["LEFT"] = 3] = "LEFT";
})(DIRECTION || (DIRECTION = {}));
class Snake {
    constructor() {
        this.body = [{ x: 0, y: 0 }];
        this.direction = DIRECTION.RIGHT;
    }
    head() {
        return this.body[0];
    }
    update() {
        const head = this.head();
        const action = {
            [DIRECTION.UP]: () => { this.body.unshift({ x: head.x, y: head.y - 1 }); },
            [DIRECTION.RIGHT]: () => { this.body.unshift({ x: head.x + 1, y: head.y }); },
            [DIRECTION.DOWN]: () => { this.body.unshift({ x: head.x, y: head.y + 1 }); },
            [DIRECTION.LEFT]: () => { this.body.unshift({ x: head.x - 1, y: head.y }); },
        };
        action[this.direction]();
        this.body.pop();
    }
}
class Game {
    constructor() {
        this.grid = [];
        this.reset_grid();
        console.log(this.grid);
        this.snake = new Snake();
    }
    reset_grid() {
        for (var i = 0; i < GRID_SIZE; i++) {
            this.grid[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                this.grid[i][j] = GRID_VALUE.EMPTY;
            }
        }
    }
    update() {
        this.reset_grid();
        this.snake.update();
        this.snake.body.forEach((position) => {
            this.grid[position.x][position.y] = GRID_VALUE.SNAKE;
        });
    }
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.grid.forEach((row, x) => {
            row.forEach((value, y) => {
                if (value === GRID_VALUE.SNAKE) {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            });
        });
    }
    start() {
        setInterval(() => {
            this.update();
            this.draw();
            console.log("bucle");
        }, 1000);
    }
}
const game = new Game();
game.start();
