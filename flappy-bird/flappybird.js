//board
let board;
let boardWidth = 1280;
let boardHeight = 620;
let context;

//bird
let birdWidth = 48; //width/height ratio = 408/228 = 17/12
let birdHeight = 48;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -3; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

// my var
let placePipe = 1700;
let gapPipe = 2; // makin tinggi makin mengecil
let scoreElement;
let topScoreElement;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore-flappy-bird') || '0';

function levelAnjay() {
  if (score == 0) {
    velocityX = -3;
    placePipe = 1700;
    gapPipe = 2;
    return;
  }

  if (score == 10) {
    velocityX = -4;
    // placePipe = placePipe - 500;
    return;
  }

  if (score == 20) {
    velocityX = -4.5;
    placePipe = 1000;
    return;
  }

  if (score == 25) {
    gapPipe = 3;
    return;
  }

  if (score == 30) {
    velocityX = -5.5;
    placePipe = 600;
    gapPipe = 4;
    return;
  }

  if (score == 40) {
    velocityX = -6;
    placePipe = 30;
    gapPipe = 4.5;
    return;
  }

  if (score >= 50) {
    velocityX = -7;
    placePipe = 5;
    gapPipe = 5;
    return;
  }
}

window.onload = function () {
  board = document.getElementById("board");
  // my func
  scoreElement = document.getElementById("score");
  topScoreElement = document.getElementById("topScore");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw flappy bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, placePipe); //every 1.5 seconds
  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //removes first element from the array
  }

  // //score
  // context.fillStyle = "white";
  // context.font = "45px sans-serif";
  // context.fillText(score, 5, 45);

  scoreElement.innerText = score;
  topScoreElement.innerText = highScore;

  levelAnjay();

  if (gameOver) {
    // context.fillText("GAME OVER", 5, 90);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore-flappy-bird', highScore);
    }
    highScore = localStorage.getItem('highScore-flappy-bird');
    document.getElementById("example-modal").classList.add("modal-open");
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  //(0-1) * pipeHeight/2.
  // 0 -> -128 (pipeHeight/4)
  // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / gapPipe;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.type == "keydown") {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
      //jump
      velocityY = -6;

      //reset game
      if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
        document.getElementById("example-modal").classList.remove("modal-open");
      }
    }
  }

  if (e.type == "click") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
      document.getElementById("example-modal").classList.remove("modal-open");
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y //a's bottom left corner passes b's top left corner
  );
}
