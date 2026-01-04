const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const gridSize = 20;
const foodData = [
    { emoji: '🍎', score: 1 },
    { emoji: '🍇', score: 2 },
    { emoji: '🍉', score: 3 },
    { emoji: '🍓', score: 4 },
    { emoji: '🍒', score: 5 },
    { emoji: '🍑', score: 6 },
    { emoji: '🍍', score: 7 },
    { emoji: '🥝', score: 8 },
    { emoji: '🥭', score: 9 },
    { emoji: '🥥', score: 10 }
];
let snake = [{ x: 10, y: 10 }];
let foods = [];
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;
let gameSpeed = 100;
let segmentsToAdd = 0;

highScoreElement.textContent = highScore;

function generateFood() {
    const foodType = foodData[Math.floor(Math.random() * foodData.length)];
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize)),
        emoji: foodType.emoji,
        score: foodType.score
    };
}

function initializeFoods() {
    const foodCount = Math.floor(Math.random() * 21) + 30; // 30 to 50
    foods = [];
    for (let i = 0; i < foodCount; i++) {
        foods.push(generateFood());
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    ctx.font = `${gridSize}px Arial`;
    foods.forEach(food => {
        ctx.fillText(food.emoji, food.x * gridSize, (food.y + 1) * gridSize);
    });
}

function update() {
    if (gameOver) {
        if (confirm('게임 오버! 다시 시작하시겠습니까?')) {
            resetGame();
        }
        return;
    }

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkCollision(head)) {
        gameOver = true;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = highScore;
        }
        return;
    }

    snake.unshift(head);

    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            score += foods[i].score;
            scoreElement.textContent = score;
            segmentsToAdd += foods[i].score;
            foods.splice(i, 1);
            foods.push(generateFood());
            break; 
        }
    }

    if (segmentsToAdd > 0) {
        segmentsToAdd--;
    } else {
        snake.pop();
    }

    draw();
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    segmentsToAdd = 0;
    gameOver = false;
    initializeFoods();
    main();
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
            break;
    }
});

function main() {
    if (gameOver) return;
    setTimeout(() => {
        update();
        main();
    }, gameSpeed);
}

initializeFoods();
main();