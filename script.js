const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const canvasSize = 400;

canvas.width = canvasSize;
canvas.height = canvasSize;

let snake, apple, score, highScores;

document.addEventListener('DOMContentLoaded', () => {
    highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
    drawHighScores();

    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
});

function startGame() {
    snake = [{ x: 10, y: 10 }];
    apple = generateApple();
    score = 0;
    direction = 'RIGHT';
    speed = 100;
    interval = setInterval(updateGame, speed);
    document.addEventListener('keydown', changeDirection);
}

function togglePause() {
    clearInterval(interval);
}

function updateGame() {
    clearCanvas();
    moveSnake();
    checkCollision();
    drawSnake();
    drawApple();
    checkAppleCollision();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
    }
    snake.unshift(head);
    snake.pop();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function generateApple() {
    return {
        x: Math.floor(Math.random() * canvasSize / gridSize),
        y: Math.floor(Math.random() * canvasSize / gridSize),
    };
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function checkAppleCollision() {
    const head = snake[0];
    if (head.x === apple.x && head.y === apple.y) {
        snake.push({ x: apple.x, y: apple.y });
        apple = generateApple();
        score++;
    }
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 || head.y < 0 || head.x >= canvasSize / gridSize || head.y >= canvasSize / gridSize ||
        snake.some((segment, idx) => idx > 0 && segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(interval);
        storeHighScore(score);
        alert('Game Over! Deine Punktzahl: ' + score);
    }
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function storeHighScore(score) {
    highScores.push(score);
    highScores = [...new Set(highScores)].sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem('snakeHighScores', JSON.stringify(highScores));
    drawHighScores();
}

function drawHighScores() {
    const highscoreList = document.getElementById('highscoreList');
    highscoreList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
}
