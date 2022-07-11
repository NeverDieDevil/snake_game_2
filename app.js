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
  forthBonus = new Object();
  score;
  scoreDisplay;
  display;

  constructor() {
    this.snake = new Snake();
    this.tileCount = 20;
    this.firstBonus.draw = false;
    this.firstBonus.pos = [];
    this.firstBonus.color = 'blue';
    this.generateBonus(this.firstBonus);
    this.secondBonus.draw = true;
    this.secondBonus.pos = [];
    this.secondBonus.color = 'yellow';
    this.generateBonus(this.secondBonus);
    this.thirdBonus.draw = true;
    this.thirdBonus.pos = [];
    this.thirdBonus.color = 'grey';
    this.generateBonus(this.thirdBonus);
    this.forthBonus.draw = true;
    this.forthBonus.pos = [];
    this.forthBonus.color = '#19E3BE';
    this.generateBonus(this.forthBonus);
    this.canvas = document.querySelector('canvas');
    this.gameField = canvas.getContext('2d');
    this.tileSize = this.canvas.width / this.tileCount - 2;
    this.speed = 8;
    this.xV = 0;
    this.yV = 0;
    this.score = 3;
    this.scoreDisplay = document.createElement('h2');
    this.display = document.querySelector('body');
    this.display.append(this.scoreDisplay);
    
    document.addEventListener('keydown', this.keyDown.bind(this));
    this.generateFood();
    this.drawGame();
  }

  drawGame() {
    this.scoreDisplay.textContent = `Score: ${this.score}`;
    this.changeSnakePos();

    let result = this.isGameOver();
    if (result) {
      return;
    }

    this.clearScreen();
    if (this.score >= 5 && this.firstBonus.draw) {
      this.drawBonus(this.firstBonus);
    }
    if (this.score >= 10 && this.secondBonus.draw) {
      this.drawBonus(this.secondBonus);
    }
    if (this.score >= 15 && this.thirdBonus.draw) {
      this.drawBonus(this.thirdBonus);
    }
    if (this.score >= 20 && this.forthBonus.draw) {
      this.drawBonus(this.forthBonus);
    }
    this.drawFood();
    this.drawSnake();
    this.checkFoodCol();
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

  checkFoodCol() {
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
    this.snake.snakeParts.forEach((ele) => {
      if (this.foodX === ele.x && this.foodY === ele.y) {
        this.generateFood();
      }
    });
  }
  generateBonus(bonus) {
    bonus.draw = true;
    bonus.pos[0] = Math.floor(Math.random() * this.tileCount);
    bonus.pos[1] = Math.floor(Math.random() * this.tileCount);
    console.log('generating Bonus at: ' + bonus.pos[0] + ':' + bonus.pos[1]);
    this.snake.snakeParts.forEach((ele) => {
      if (bonus.pos[0] === ele.x && bonus.pos[1] === ele.y) {
        console.log('generate again');
        this.generateBonus(bonus);
        
      }
    });
  }
  checkBonusCol() {
    let timeout = Math.random() * 10000 + 5000;
    if (
      this.snake.headX === this.firstBonus.pos[0] &&
      this.snake.headY === this.firstBonus.pos[1] &&
      this.firstBonus.draw && this.score >= 5
    ) {
      this.firstBonus.draw = false;
      setTimeout(this.generateBonus.bind(this), timeout, this.firstBonus);
      this.speed /= 5;
      setTimeout(
        function () {
          this.speed = 15;
        }.bind(this),
        3000
      );
    }
    if (
      this.snake.headX === this.secondBonus.pos[0] &&
      this.snake.headY === this.secondBonus.pos[1] &&
      this.secondBonus.draw && this.score >= 10
    ) {
      this.secondBonus.draw = false;
      setTimeout(this.generateBonus.bind(this), timeout, this.secondBonus);
      this.speed *= 5;
      setTimeout(
        function () {
          this.speed = 7;
        }.bind(this),
        3000
      );
    }
    if (
      this.snake.headX === this.thirdBonus.pos[0] &&
      this.snake.headY === this.thirdBonus.pos[1] &&
      this.thirdBonus.draw&& this.score >= 15
    ) {
      this.thirdBonus.draw = false;
      setTimeout(this.generateBonus.bind(this), timeout, this.thirdBonus);
      this.snake.snakeParts.shift();
      this.snake.tailLength--;
    }
    if (
      this.snake.headX === this.forthBonus.pos[0] &&
      this.snake.headY === this.forthBonus.pos[1] &&
      this.forthBonus.draw&& this.score >= 20
    ) {
      this.forthBonus.draw = false;
      setTimeout(this.generateBonus.bind(this), timeout, this.forthBonus);
      this.snake.tailLength++;
    }
  }

  drawBonus(bonus) {
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
    this.tailLength = 10;
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

//https://stackoverflow.com/questions/71570107/javascript-snake-game-too-much-recursion-error
