"use strict";
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
const game = {
    grid: new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(GRID_VALUE.EMPTY)),
    snake: new Snake(),
    reset_grid: function () { this.grid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(GRID_VALUE.EMPTY)); },
    update: function () {
        this.snake.update();
        this.reset_grid();
        this.snake.body.forEach((position) => {
            this.grid[position.x][position.y] = GRID_VALUE.SNAKE;
        });
    },
    draw: function () {
    },
    start: function () {
        while (true) {
            this.update();
            this.draw();
        }
    },
};
game.start();
