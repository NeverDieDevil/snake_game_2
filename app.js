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
  firstBonus = new Object();
  secondBonus = new Object();
  thirdBonus = new Object();
  score;

  constructor() {
    this.firstBonus.drawn = false;
    this.firstBonus.pos = [0, 0];
    this.firstBonus.color = 'blue';
    this.secondBonus.drawn = false;
    this.secondBonus.pos = [0, 0];
    this.secondBonus.color = 'yellow';
    this.thirdBonus.drawn = false;
    this.thirdBonus.pos = [0, 0];
    this.thirdBonus.color = 'green';
    this.canvas = document.querySelector('canvas');
    this.gameField = canvas.getContext('2d');
    this.tileCount = 20;
    this.tileSize = this.canvas.width / this.tileCount - 2;
    this.speed = 7;
    this.xV = 0;
    this.yV = 0;
    this.score = 4;
    this.generateFood();
    this.snake = new Snake();
    document.addEventListener('keydown', this.keyDown.bind(this));
    this.drawGame();
  }

  drawGame() {
    this.changeSnakePos();

    let result = this.isGameOver();
    if (result) {
      return;
    }
    if (this.score >= 5) {
      this.drawBonus(this.firstBonus);
      console.log(this.firstBonus.pos);
    }
    if (this.score >= 10) {
      this.drawBonus(this.secondBonus);
    }
    if (this.score >= 15) {
      this.drawBonus(this.thirdBonus);
    }
    this.clearScreen();
    this.drawFood();
    this.drawSnake();
    this.checkAppleCol();
    this.checkBonusCol();
    setTimeout(this.drawGame.bind(this), 1000 / this.speed);
  }

  isGameOver() {
    let gameOver = false;

    //body
    if (this.xV === 0 && this.yV === 0) {
      return false;
    }

    this.snake.snakeParts.forEach((element) => {
      if (element.x === this.snake.headX && element.y === this.snake.headY) {
        gameOver = true;
      }
    });

    if (gameOver) {
      this.gameField.fillStyle = 'white';
      this.gameField.font = '50px Verdana';
      this.gameField.fillText(
        'Game Over!',
        this.canvas.width / 6.5,
        this.canvas.height / 2
      );
    }

    return gameOver;
  }

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
  generateBonus(bonus) {
    this.bonus.pos[0] = Math.floor(Math.random() * this.tileCount);
    this.bonus.pos[1] = Math.floor(Math.random() * this.tileCount);
  }
  checkBonusCol() {
    if (
      this.snake.headX === this.firstBonus.pos[0] &&
      this.snake.headY === this.firstBonus.pos[1] &&
      this.firstBonus.drawn
    ) {
      let timeout = Math.random() * 10;

      setTimeout(this.generateBonus(this.firstBonus).bind(this), timeout);
    }
    if (
      this.snake.headX === this.secondBonus[0] &&
      this.snake.headY === this.secondBonus[1] &&
      this.secondBonus.drawn
    ) {
      let timeout = Math.random() * 10;
      setTimeout(this.generateBonus(secondBonus).bind(this), timeout);
    }
    if (
      this.snake.headX === this.firstBonus[0] &&
      this.snake.headY === this.thirdBonus[1] &&
      this.thirdBonus.drawn
    ) {
      let timeout = Math.random() * 10;
      setTimeout(this.generateBonus(this.thirdBonus).bind(this), timeout);
    }
  }

  drawBonus(bonus) {
    console.log('drawing bonus:' + bonus.color);
    bonus.drawn = true;
    this.gameField.fillStyle = bonus.color;
    this.gameField.fillRect(
      bonus.pos[0] * this.tileCount,
      bonus.pos[1] * this.tileCount,
      this.tileSize,
      this.tileSize
    );
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
    if (this.snake.headX > this.tileCount - 1) {
      this.snake.headX = 0;
    }
    if (this.snake.headX < 0) {
      this.snake.headX = this.tileCount - 1;
    }
    if (this.snake.headY > this.tileCount - 1) {
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
