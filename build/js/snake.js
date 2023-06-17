"use strict";
const canvas = document.getElementById('canvas');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Canvas not found');
}
const ctx = canvas.getContext('2d');
if (!(ctx instanceof CanvasRenderingContext2D)) {
    throw new Error('Canvas context not found');
}
const scoreElement = document.getElementById('score');
const SPEED = 100; // milliseconds
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
const OPPOSITE_DIRECTION = {
    [DIRECTION.UP]: DIRECTION.DOWN,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
};
var KEY;
(function (KEY) {
    KEY["ArrowUp"] = "ArrowUp";
    KEY["ArrowRight"] = "ArrowRight";
    KEY["ArrowDown"] = "ArrowDown";
    KEY["ArrowLeft"] = "ArrowLeft";
})(KEY || (KEY = {}));
const BLACK = '#000';
const GREEN = '#8cbe02';
const RED = '#f00';
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
            [DIRECTION.UP]: () => { this.body.unshift({ x: head.x, y: ((head.y > 0) ? head.y - 1 : GRID_SIZE - 1), }); },
            [DIRECTION.RIGHT]: () => { this.body.unshift({ x: (head.x + 1) % GRID_SIZE, y: head.y }); },
            [DIRECTION.DOWN]: () => { this.body.unshift({ x: head.x, y: (head.y + 1) % GRID_SIZE }); },
            [DIRECTION.LEFT]: () => { this.body.unshift({ x: ((head.x > 0) ? head.x - 1 : GRID_SIZE - 1), y: head.y }); },
        };
        action[this.direction]();
        this.body.pop();
    }
    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push(tail);
    }
    does_eats_itself() {
        let collide = false;
        this.body.slice(1).forEach((position) => {
            if (position.x === this.head().x && position.y === this.head().y) {
                collide = true;
            }
        });
        return collide;
    }
    change_direction(new_direction) {
        if (OPPOSITE_DIRECTION[this.direction] === new_direction)
            return;
        this.direction = new_direction;
    }
}
class Game {
    constructor() {
        this.grid = [];
        this.reset_grid();
        this.snake = new Snake();
        this.food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * (GRID_SIZE - 1) + 1)
        };
    }
    place_new_food() {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        this.grid[x][y] = GRID_VALUE.FOOD;
        this.food = { x, y };
    }
    does_snake_eats_food() {
        return this.snake.head().x === this.food.x && this.snake.head().y === this.food.y;
    }
    does_snake_eats_itself() {
        return this.snake.does_eats_itself();
    }
    reset_grid() {
        for (var i = 0; i < GRID_SIZE; i++) {
            this.grid[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                this.grid[i][j] = GRID_VALUE.EMPTY;
            }
        }
    }
    update_score() {
        scoreElement.innerHTML = ((this.snake.body.length - 1) * 2).toString();
    }
    update() {
        this.reset_grid();
        this.snake.update();
        if (this.does_snake_eats_itself()) {
            this.game_over();
        }
        if (this.does_snake_eats_food()) {
            this.snake.grow();
            this.place_new_food();
            this.update_score();
        }
        this.snake.body.forEach((position) => {
            this.grid[position.x][position.y] = GRID_VALUE.SNAKE;
        });
        this.grid[this.food.x][this.food.y] = GRID_VALUE.FOOD;
    }
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = GREEN;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.grid.forEach((row, x) => {
            row.forEach((value, y) => {
                if (value === GRID_VALUE.SNAKE) {
                    ctx.fillStyle = BLACK;
                    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
                else if (value === GRID_VALUE.FOOD) {
                    ctx.fillStyle = BLACK;
                    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            });
        });
    }
    start() {
        window.addEventListener('keydown', this.handle_keydown.bind(this));
    }
    loop() {
        setInterval(() => {
            this.update();
            this.draw();
        }, SPEED);
    }
    game_over() {
        alert(`Game Over!\nYour final score is ${scoreElement.innerHTML}`);
        window.location.reload();
    }
    handle_keydown(event) {
        var _a;
        if (!((_a = Object.values(KEY)) === null || _a === void 0 ? void 0 : _a.includes(event.key)))
            return;
        const action = {
            [KEY.ArrowUp]: () => { this.snake.change_direction(DIRECTION.UP); },
            [KEY.ArrowRight]: () => { this.snake.change_direction(DIRECTION.RIGHT); },
            [KEY.ArrowDown]: () => { this.snake.change_direction(DIRECTION.DOWN); },
            [KEY.ArrowLeft]: () => { this.snake.change_direction(DIRECTION.LEFT); },
        };
        action[event.key]();
    }
}
const game = new Game();
game.start();
game.loop();
