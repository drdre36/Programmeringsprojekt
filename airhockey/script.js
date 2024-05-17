const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// bilder och skit
const backgroundImage = 'bilder/football-field.png';
const paddleLeftImage = 'bilder/Spelare-1.png';
const paddleRightImage = 'bilder/Spelare-2.png';
const ballImage = 'bilder/fotboll.png';

// skapa poäng tavlan
let scoreLeft = 0;
let scoreRight = 0;
const scoreboard = document.createElement('div');
scoreboard.innerText = `Score: Left ${scoreLeft} - Right ${scoreRight}`;
scoreboard.style.position = 'absolute';
scoreboard.style.top = '20px';
scoreboard.style.left = '50%';
scoreboard.style.transform = 'translateX(-50%)';
document.body.appendChild(scoreboard);

// Ladda in bilderna (guiden)
const images = {};
const loadImage = (key, src) => {
  const img = new Image();
  img.src = src;
  images[key] = img;
};

loadImage('background', backgroundImage);
loadImage('paddleLeft', paddleLeftImage);
loadImage('paddleRight', paddleRightImage);
loadImage('ball', ballImage);

// Fotbolls proffsen
const paddleWidth = 55;
const paddleHeight = 95;
const paddleXMargin = 50; // Margin from the side
let paddleLeftX = paddleXMargin;
let paddleLeftY = (canvas.height - paddleHeight) / 2;
let paddleRightX = canvas.width - paddleXMargin - paddleWidth;
let paddleRightY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;
let leftPaddleSpeedX = 0;
let leftPaddleSpeedY = 0;
let rightPaddleSpeedX = 0;
let rightPaddleSpeedY = 0;

// Fotbollen
const ballSize = 20;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Vilken yta som räknas som ett mål
const goalTop = 165;
const goalBottom = 420;
const goalWidth = 20;

function gameLoop() {
    // clearar canvasen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    // draw bakgrund
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
 
    // drwa fotbollsspelare
    ctx.drawImage(images.paddleLeft, paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
    ctx.drawImage(images.paddleRight, paddleRightX, paddleRightY, paddleWidth, paddleHeight);
 
    // Draw ball
    ctx.drawImage(images.ball, ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
 
    // flytta spelarna
    paddleLeftX += leftPaddleSpeedX;
    paddleLeftY += leftPaddleSpeedY;
    paddleRightX += rightPaddleSpeedX;
    paddleRightY += rightPaddleSpeedY;
 
if (paddleLeftX < 0) paddleLeftX = 0;
if (paddleLeftY < 0) paddleLeftY = 0;
if (paddleLeftY > canvas.height - paddleHeight) paddleLeftY = canvas.height - paddleHeight;
if (paddleRightX > canvas.width - paddleWidth) paddleRightX = canvas.width - paddleWidth;
if (paddleRightY < 0) paddleRightY = 0;
if (paddleRightY > canvas.height - paddleHeight) paddleRightY = canvas.height - paddleHeight;

    // flytta bollen                                                                                                                                                                                                                                                                                                         
    ballX += ballSpeedX;
    ballY += ballSpeedY;
 
    // Bollen kolliderar med väggarna
    if (ballX < ballSize / 2 || ballX > canvas.width - ballSize / 2) {
      ballSpeedX *= -1;
    }
    if (ballY < ballSize / 2 || ballY > canvas.height - ballSize / 2) {
      ballSpeedY *= -1;
    }
 
// bollen kolliderar med Fotbolls spelarna
if (
    ballX - ballSize / 2 <= paddleLeftX + paddleWidth &&
    ballX + ballSize / 2 >= paddleLeftX &&
    ballY + ballSize / 2 >= paddleLeftY &&
    ballY - ballSize / 2 <= paddleLeftY + paddleHeight
  ) {
    // kalkulerar hur bollen flyger efter infallsvinkeln för vänster sidan
    const ballRelativeIntersectY = paddleLeftY + paddleHeight / 2 - ballY;
    const normalizedRelativeIntersectY = ballRelativeIntersectY / (paddleHeight / 2);
    const bounceAngle = normalizedRelativeIntersectY * Math.PI / 4; // 
  
    // Skickar iväg bollen i den kalkylerade riktningen
    ballSpeedX = 5 * Math.cos(bounceAngle);
    ballSpeedY = 5 * Math.sin(bounceAngle);
  
    // se till att bollen kolliderar med spelarna bra
    ballX = paddleLeftX + paddleWidth + ballSize / 2;
  
    // Ser till att bollen inte fastnar konstigt i padeln
    if (ballX > canvas.width - ballSize / 2) {
      ballX = canvas.width - ballSize / 2;
    }
  }
  
  if (
    ballX + ballSize / 2 >= paddleRightX &&
    ballX - ballSize / 2 <= paddleRightX + paddleWidth &&
    ballY + ballSize / 2 >= paddleRightY &&
    ballY - ballSize / 2 <= paddleRightY + paddleHeight
  ) {
    // kalkulerar hur bollen flyger efter infallsvinkeln för högersidan
    const ballRelativeIntersectY = paddleRightY + paddleHeight / 2 - ballY;
    const normalizedRelativeIntersectY = ballRelativeIntersectY / (paddleHeight / 2);
    const bounceAngle = normalizedRelativeIntersectY * Math.PI / 4; // Max bounce angle of π/4 radians (45 degrees)
  
    // Skickar iväg bollen i den kalkylerade riktningen
    ballSpeedX = -7 * Math.cos(bounceAngle);
    ballSpeedY = 7 * Math.sin(bounceAngle);
  
    //  se till att bollen kolliderar med spelarna bra
    ballX = paddleRightX - ballSize / 2;
  
    // Ser till att bollen inte fastnar konstigt i padeln
    if (ballX < ballSize / 2) {
      ballX = ballSize / 2;
    }
  }
  
  
    // detektera när bollen går i mål
    if (ballX <= goalWidth) {
      if (ballY >= goalTop && ballY <= goalBottom) {
        scoreRight++;
        resetBall();
      }
    } else if (ballX >= canvas.width - goalWidth) {
      if (ballY >= goalTop && ballY <= goalBottom) {
        scoreLeft++;
        resetBall();
      }
    }

    //Fonten för och storleken för scoreboarden
    scoreboard.innerText = `${scoreLeft} - ${scoreRight}`;
    scoreboard.style.fontFamily = "'score', sans-serif";
    scoreboard.style.fontSize = "40px"
 
    requestAnimationFrame(gameLoop);
  }

// Resetar bollen efter ett mål på den sidan av plan där målet har gjorts
function resetBall() {
   // Kollar vilken sida som målet gjordes på 
  const scoringSide = ballX <= goalWidth ? "Right" : "Left";

   // Resetar bollen till den sidan som släptt in mål
  ballX = canvas.width / 2;
  ballY = canvas.height / 2 - 10; 
  
  // gör så bollen står still efter att den resetar 
  ballSpeedX = 0;
  ballSpeedY = 0;

  // Reset paddles to their initial positions
  paddleLeftX = paddleXMargin;
  paddleLeftY = (canvas.height - paddleHeight) / 2;
  paddleRightX = canvas.width - paddleXMargin - paddleWidth;
  paddleRightY = (canvas.height - paddleHeight) / 2;
}


// Event listeners för rörelsea av spelarna
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    // Vänster spelare kontroll
    case 'w':
      leftPaddleSpeedY = -paddleSpeed;
      break;
    case 's':
      leftPaddleSpeedY = paddleSpeed;
      break;
    case 'a':
      leftPaddleSpeedX = -paddleSpeed;
      break;
    case 'd':
      leftPaddleSpeedX = paddleSpeed;
      break;
    // Höger spelare kontroll
    case 'ArrowUp':
      rightPaddleSpeedY = -paddleSpeed;
      break;
    case 'ArrowDown':
      rightPaddleSpeedY = paddleSpeed;
      break;
    case 'ArrowLeft':
      rightPaddleSpeedX = -paddleSpeed;
      break;
    case 'ArrowRight':
      rightPaddleSpeedX = paddleSpeed;
      break;
  }
});




document.addEventListener('keyup', (e) => {
  switch (e.key) {
    // Vänster spelare kontroll
    case 'w':
    case 's':
      leftPaddleSpeedY = 0;
      break;
    case 'a':
    case 'd':
      leftPaddleSpeedX = 0;
      break;
    // Höger sppelare kontroll
    case 'ArrowUp':
    case 'ArrowDown':
      rightPaddleSpeedY = 0;
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      rightPaddleSpeedX = 0;
      break;
  }
});


// Starta game loopen
gameLoop();