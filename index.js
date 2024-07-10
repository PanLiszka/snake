const board = document.querySelector(".container .game");
const scoreDisplay = document.querySelector(".container .score .score-value");
const gameOverDisplay = document.querySelector(".container .game-over");
const gameOverScoreDisplay = document.querySelector(
    ".container .game-over .game-over-score",
);
const restartButton = document.querySelector(".container .game-over .restart");

let isOver = false;
let interval;

let foodImages = ["apple.png", "carrot.png", "cherry.png", "orange.png"];
let foodImage = foodImages[Math.floor(Math.random() * foodImages.length)];

//                  x, y
let foodPosition = [10, 10];
let snakePosition = [5, 5];

let movePixels = [0, 0];

// [ [x,y], [x,y], [x,y] ]
let snakeBody = [];

const createGame = () => {
    if (isOver) {
        endGame();
    }

    // Jeśli wąż zje jedzonko
    if (
        snakePosition[0] === foodPosition[0] &&
        snakePosition[1] === foodPosition[1]
    ) {
        moveFood();
        foodImage = foodImages[Math.floor(Math.random() * foodImages.length)];

        // Zwiększanie węża
        snakeBody.push([snakePosition[0], snakePosition[1]]);

        scoreDisplay.innerHTML = Number(scoreDisplay.innerHTML) + 1;
    }

    snakePosition[0] += movePixels[0];
    snakePosition[1] += movePixels[1];

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakePosition[0], snakePosition[1]];

    // Sprawdzanie czy wąż nie wlazł w ścianę
    if (
        snakePosition[0] <= 0 ||
        snakePosition[0] > 30 ||
        snakePosition[1] <= 0 ||
        snakePosition[1] > 30
    )
        return (isOver = true);

    // Jedzonko widoczne na planszy => .food
    let li = `<div class="food" style="grid-area: ${foodPosition[1]} / ${foodPosition[0]}; background-image: url('./food/${foodImage}')"></div>`;

    for (let i = 0; i < snakeBody.length; i++) {
        li += `<div class="snake-body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Sprawdzanie czy wąż nie zjadł samego siebie
        if (
            i !== 0 &&
            snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]
        )
            return (isOver = true);
    }

    // Wąż widoczny na planszy => .snake
    li += `<div class="snake" style="grid-area: ${snakePosition[1]} / ${snakePosition[0]}"></div>`;

    board.innerHTML = li;
};

// Funkcja do przesuwania jedzonka
const moveFood = () => {
    foodPosition[0] = Math.floor(Math.random() * 30) + 1;
    foodPosition[1] = Math.floor(Math.random() * 30) + 1;
};

const getCurrentDirection = () => {
    if (movePixels[0] === 0 && movePixels[1] === -1) return "up";
    if (movePixels[0] === 0 && movePixels[1] === 1) return "down";
    if (movePixels[0] === -1 && movePixels[1] === 0) return "left";
    if (movePixels[0] === 1 && movePixels[1] === 0) return "right";
};
const changeDirection = (direction) => {
    if (direction == getCurrentDirection()) return;

    console.log(getCurrentDirection());
    switch (direction) {
        case "up":
            movePixels = [0, -1];
            break;
        case "down":
            movePixels = [0, 1];
            break;
        case "left":
            movePixels = [-1, 0];
            break;
        case "right":
            movePixels = [1, 0];
            break;
    }
    /* createGame(); */
};

document.body.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            changeDirection("up");
            break;
        case "ArrowDown":
            changeDirection("down");
            break;
        case "ArrowLeft":
            changeDirection("left");
            break;
        case "ArrowRight":
            changeDirection("right");
            break;
        case "a":
            changeDirection("left");
            break;
        case "w":
            changeDirection("up");
            break;
        case "d":
            changeDirection("right");
            break;
        case "s":
            changeDirection("down");
            break;
    }
});

let endGame = () => {
    clearInterval(interval);
    gameOverScoreDisplay.innerHTML = scoreDisplay.innerHTML;
    gameOverDisplay.style.top = "0";

    if (localStorage.getItem("highscore")) {
        if (
            Number(localStorage.getItem("highscore")) <
            Number(scoreDisplay.innerHTML)
        ) {
            localStorage.setItem("highscore", scoreDisplay.innerHTML);
        }
    } else {
        localStorage.setItem("highscore", scoreDisplay.innerHTML);
    }

    document.querySelector(".highscore").innerHTML =
        localStorage.getItem("highscore");
};

restartButton.addEventListener("click", () => {
    location.reload();
});

moveFood();
interval = setInterval(() => {
    createGame();
}, 200);
createGame();
