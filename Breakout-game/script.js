const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//[[{00},{01},{02},{03},{04}],[{10},{11},{12},{13},{14}],[{20},{21},{22},{23},{24}],[],[],[],[],[],[]]
//we are drawing the bricks by column starting from x-axis 45 and y-axis 60
//brick.x = 45,45,45,45,45     125,125,125,125,125
//brick.y = 60,90,120,150,180  60,90,120,150,180
//each brick have a size of 80x*30y, the filling is only 70x*20y, extra is padding(in white)

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function movePaddle() {
  paddle.x += paddle.dx;
  // console.log("movePaddle ran");

  //wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // console.log(`moveBall ran`);

  //wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; //right:reduce ball.x position, left: change ball.x position to positive
  }

  //wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x && //left side of paddle
    ball.x + ball.size < paddle.x + paddle.w && //right side of paddle
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
    //if it is between the paddle width, and is higher than the paddle, then bounce the ball back up
  }

  //Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          //left brick side check
          ball.x + ball.size < brick.x + brick.w &&
          //right brick side check
          ball.y + ball.size > brick.y &&
          //top brick side check
          ball.y - ball.size < brick.y + brick.h //bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });
  // Hit bottom wall - lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//Increase score
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

//Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

//draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  draw();

  requestAnimationFrame(update);
}

update();
// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//show and hide rules handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
