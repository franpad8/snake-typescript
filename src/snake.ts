const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

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

enum KEY {
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
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
      [DIRECTION.UP]: () => { this.body.unshift({x: head.x, y: ((head.y > 0) ? head.y - 1 : GRID_SIZE-1),}) },
      [DIRECTION.RIGHT]: () => { this.body.unshift({x: (head.x + 1) % GRID_SIZE, y: head.y}) },
      [DIRECTION.DOWN]: () => { this.body.unshift({x: head.x, y: (head.y + 1) % GRID_SIZE}) },
      [DIRECTION.LEFT]: () => { this.body.unshift({x: ((head.x > 0) ? head.x - 1 : GRID_SIZE-1), y: head.y}) },
    }
    action[this.direction]()
    this.body.pop()
  }

  move(direction: DIRECTION) {
    this.direction = direction
  }
}
class Game {
  grid: GRID_VALUE[][]
  snake: Snake
  food: Position
  constructor() {
    this.grid = []
    this.reset_grid()
    this.snake = new Snake()
    this.food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * (GRID_SIZE-1) + 1)
    }
  }

  private place_food() {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    if (this.grid[x][y] === GRID_VALUE.EMPTY) {
      this.grid[x][y] = GRID_VALUE.FOOD
      this.food = {x, y}
    } else {
      this.place_food()
    }
  }
  private reset_grid() {
    for(var i: number = 0; i < GRID_SIZE; i++) {
      this.grid[i] = [];
      for(var j: number = 0; j< GRID_SIZE; j++) {
          this.grid[i][j] = GRID_VALUE.EMPTY;
      }
    }
  }
  private update() {
    this.reset_grid()
    this.snake.update()
    this.snake.body.forEach((position) => {
      this.grid[position.x][position.y] = GRID_VALUE.SNAKE
    })
    this.grid[this.food.x][this.food.y] = GRID_VALUE.FOOD
  }
  private draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.grid.forEach((row, x) => {
      row.forEach((value, y) => {
        if (value === GRID_VALUE.SNAKE) {
          ctx.fillStyle = '#000'
          ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        }
        else if (value === GRID_VALUE.FOOD) {
          ctx.fillStyle = '#f00'
          ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        }
      })
    })
  }

  start() {
    window.addEventListener('keydown', this.handle_keydown.bind(this))
  }
  loop() {
    setInterval(() => {
      this.update()
      this.draw()
    }, 500)
  }
  private handle_keydown(event: KeyboardEvent) {
    if (!(event.key in KEY)) return

    const action = {
      [KEY[KEY.ArrowUp]]: () => { this.snake.move(DIRECTION.UP) },
      [KEY[KEY.ArrowRight]]: () => { this.snake.move(DIRECTION.RIGHT) },
      [KEY[KEY.ArrowDown]]: () => { this.snake.move(DIRECTION.DOWN) },
      [KEY[KEY.ArrowLeft]]: () => { this.snake.move(DIRECTION.LEFT) },
    }
    action[event.key]()
  }
}

const game = new Game()
game.start()
game.loop()
