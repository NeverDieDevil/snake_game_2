const canvas = document.querySelector('canvas');
const gameField = canvas.getContext('2d');

class Game {
  speed;
  canvas;
  gameField;
  tileCount;
  tileSize;
  xV;
  yV;
  foodX;
  foodY;
  score;

  constructor() {
    this.canvas = document.querySelector('canvas');
    this.gameField = canvas.getContext('2d');
    this.tileCount = 20;
    this.tileSize = this.canvas.width / this.tileCount - 2;
    this.speed = 7;
    this.xV = 0;
    this.yV = 0;
    this.score = 0;
    this.generateFood();
    this.snake = new Snake();
    document.addEventListener('keydown', this.keyDown.bind(this));
    this.drawGame();
  }

  drawGame() {
    this.changeSnakePos();

    // let result = this.isGameOver();
    // if(result){
    //     return;
    // }

    this.clearScreen();
    this.drawFood();
    this.drawSnake();
    this.checkAppleCol();
    setTimeout(this.drawGame.bind(this), 1000 / this.speed);
  }

  //   isGameOver(){
  //     let gameOver = false;

  //     //
  //   }

  clearScreen() {
    this.gameField.fillStyle = 'black';
    this.gameField.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawSnake() {
    this.gameField.fillStyle = 'green';
    this.snake.snakeParts.forEach((element) => {
      this.gameField.fillRect(
        element.x * this.tileCount,
        element.y * this.tileCount,
        this.tileSize,
        this.tileSize
      );
    });
    this.snake.snakeParts.push(
      new SnakeParts(this.snake.headX, this.snake.headY)
    ); //put the item to the end, next to head;
    if (this.snake.snakeParts.length > this.snake.tailLength) {
      this.snake.snakeParts.shift(); // remove the furthers item from snake
    }
    this.gameField.fillStyle = 'white';
    this.gameField.fillRect(
      this.snake.headX * this.tileCount,
      this.snake.headY * this.tileCount,
      this.tileSize,
      this.tileSize
    );
  }
  drawFood() {
    this.gameField.fillStyle = 'red';
    this.gameField.fillRect(
      this.foodX * this.tileCount,
      this.foodY * this.tileCount,
      this.tileSize,
      this.tileSize
    );
  }

  checkAppleCol() {
    if (this.snake.headX === this.foodX && this.snake.headY === this.foodY) {
      this.score += 1;
      this.generateFood();
      console.log(`Score is ${this.score}`);
      this.snake.tailLength++;
    }
  }
  generateFood() {
    this.foodX = Math.floor(Math.random() * this.tileCount);

    this.foodY = Math.floor(Math.random() * this.tileCount);
  }

  keyDown(event) {
    // if (event.keyCode == 38) {
    //   this.xV = 0;
    //   this.yV = -1;
    //   console.log(this.yV);
    // }
    switch (event.keyCode) {
      //left
      case 37:
        if (this.xV === 1) return;
        this.xV = -1;
        this.yV = 0;
        break;
      //up
      case 38:
        if (this.yV === 1) return;
        this.xV = 0;
        this.yV = -1;
        break;
      //right
      case 39:
        if (this.xV === -1) return;
        this.xV = 1;
        this.yV = 0;
        break;
      //down
      case 40:
        if (this.yV === -1) return;
        this.xV = 0;
        this.yV = 1;
        break;
    }
  }
  changeSnakePos() {
    this.snake.headX += this.xV;
    this.snake.headY += this.yV;
    if (this.snake.headX > this.tileCount-1) {
      this.snake.headX = 0;
    }
    if (this.snake.headX < 0) {
      this.snake.headX = this.tileCount - 1;
    }
    if (this.snake.headY > this.tileCount-1) {
      this.snake.headY = 0;
    }
    if (this.snake.headY < 0) {
      this.snake.headY = this.tileCount - 1;
    }
  }
}

class Snake {
  headX;
  headY;
  snakeParts = [];
  tailLength;
  constructor() {
    this.headX = 10;
    this.headY = 10;
    this.tailLength = 2;
  }
}

class SnakeParts {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const game = new Game();

// function refresh(){
//     console.log('refreshing');
//     setTimeout(refresh, 1000);
// }
// refresh();
