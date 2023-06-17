const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found')
}

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
if (!(ctx instanceof CanvasRenderingContext2D)) {
  throw new Error('Canvas context not found')
}

const scoreElement: HTMLElement = document.getElementById('score') as HTMLElement

const SPEED = 100 // milliseconds

const GRID_SIZE:number = 20

enum GRID_VALUE {
  EMPTY = 0,
  SNAKE = 1,
  FOOD = 2,
}

enum DIRECTION {
  UP = 0,
  RIGHT,
  DOWN,
  LEFT,
}

const OPPOSITE_DIRECTION = {
  [DIRECTION.UP] : DIRECTION.DOWN,
  [DIRECTION.RIGHT] : DIRECTION.LEFT,
  [DIRECTION.DOWN] : DIRECTION.UP,
  [DIRECTION.LEFT] : DIRECTION.RIGHT,
}

enum KEY {
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft'
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

  grow() {
    const tail = this.body[this.body.length - 1]
    this.body.push(tail)
  }

  does_eats_itself() {
    let collide: boolean = false
    this.body.slice(1).forEach((position) => {
      if (position.x === this.head().x && position.y === this.head().y) {
        collide = true
      }
    })
    return collide
  }

  change_direction(new_direction: DIRECTION) {
    if (OPPOSITE_DIRECTION[this.direction] === new_direction) return

    this.direction = new_direction
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

  private place_new_food() {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)

    this.grid[x][y] = GRID_VALUE.FOOD
    this.food = {x, y}
  }

  private does_snake_eats_food() {
    return this.snake.head().x === this.food.x && this.snake.head().y === this.food.y
  }

  private does_snake_eats_itself() {
    return this.snake.does_eats_itself()
  }

  private reset_grid() {
    for(var i: number = 0; i < GRID_SIZE; i++) {
      this.grid[i] = [];
      for(var j: number = 0; j< GRID_SIZE; j++) {
          this.grid[i][j] = GRID_VALUE.EMPTY;
      }
    }
  }

  private update_score() {
    scoreElement.innerHTML = ((this.snake.body.length - 1) * 2).toString()
  }

  private update() {
    this.reset_grid()
    this.snake.update()

    if (this.does_snake_eats_itself()){
      this.game_over()
    }
    if (this.does_snake_eats_food()){
      this.snake.grow()
      this.place_new_food()
      this.update_score()
    }

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
    }, SPEED)
  }

  game_over() {
    alert(`Game Over!\nYour final score is ${scoreElement.innerHTML}`)
    window.location.reload()
  }

  private handle_keydown(event: KeyboardEvent) {
    if (!Object.values(KEY)?.includes(event.key as KEY)) return

    const action = {
      [KEY.ArrowUp]: () => { this.snake.change_direction(DIRECTION.UP) },
      [KEY.ArrowRight]: () => { this.snake.change_direction(DIRECTION.RIGHT) },
      [KEY.ArrowDown]: () => { this.snake.change_direction(DIRECTION.DOWN) },
      [KEY.ArrowLeft]: () => { this.snake.change_direction(DIRECTION.LEFT) },
    }
    action[event.key as KEY]()
  }
}

const game = new Game()
game.start()
game.loop()
