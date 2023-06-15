const GRID_SIZE:number = 20
enum GRID_VALUE {
  EMPTY = 0,
  SNAKE = 1,
  FOOD = 2,
}
enum DIRECTION {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

type Position = {x: number, y: number}

class Snake {
  body: Position[]
  direction: DIRECTION
  constructor() {
    this.body = [{x: 0, y: 0}]
    this.direction = DIRECTION.RIGHT
  }
  head() {
    return this.body[0]
  }

  update() {
    const head = this.head()
    const action = {
      [DIRECTION.UP]: () => { this.body.unshift({x: head.x, y: head.y - 1}) },
      [DIRECTION.RIGHT]: () => { this.body.unshift({x: head.x + 1, y: head.y}) },
      [DIRECTION.DOWN]: () => { this.body.unshift({x: head.x, y: head.y + 1}) },
      [DIRECTION.LEFT]: () => { this.body.unshift({x: head.x - 1, y: head.y}) },
    }
    action[this.direction]()
    this.body.pop()
  }
}

const game = {
  grid: new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(GRID_VALUE.EMPTY)),
  snake: new Snake(),
  reset_grid: function() { this.grid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(GRID_VALUE.EMPTY)) },
  update: function() {
    this.snake.update()
    this.reset_grid()
    this.snake.body.forEach((position) => {
      this.grid[position.x][position.y] = GRID_VALUE.SNAKE
    })
  },
  draw: function() {

  },
  start: function() {
    while (true) {
      this.update()
      this.draw()
    }
  },
}

game.start()

