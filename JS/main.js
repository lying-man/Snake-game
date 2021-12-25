"use strict";

const $box = document.querySelector(".box");
const $scoreIndex = document.querySelector(".score-index");
const $overlay = document.querySelector(".overlay");
const $modalGameOver = document.querySelector(".modal-game");
const $scoreModal = document.querySelector(".score-modal");
const $btnRestart = document.querySelector(".btn-restart");
const $btnRestartManual = document.querySelector(".btn-restart-manual");
const $getHelp = document.querySelector(".get-help");
const $helpBody = document.querySelector(".help-body");

let arrFoodUsefull = [
    "Images/apple.svg",
    "Images/cabbage.svg",
    "Images/carrot.svg"
];

let arrFoodUseless = [
    "Images/burger.svg",
    "Images/pizza.svg"
];

let arrayFood = [arrFoodUsefull, arrFoodUseless];

let eatedFood = "usefull";
let indexEl = 0;
let direction = "down";
let snakeSize = 20;
let snakeBody = [];
let cordsFood;
let snakeSpeed = 120;
let gameInterval;
let score = 0;
let eatedUseless = true;
let uselessTimeout;

class Snake {
    constructor(x, y, $element) {
        this.$el = $element,
        this.x = x,
        this.y = y
    }
}

class Food {
    constructor() {

        let obj = randomCords();

        this.x = obj.x,
        this.y = obj.y
    }
}

function randomCords() {

    wrapper: while (true) {
        let cordX = Math.floor(Math.random() * ($box.offsetWidth - 20));
        let cordY = Math.floor(Math.random() * ($box.offsetHeight - 20));

        for (let elem of snakeBody) {

            if (elem.x === cordX || elem.y === cordY ) continue wrapper;

        }

        if (cordX % 20 === 0 && cordY % 20 === 0) {
            return { x: cordX, y: cordY };
        }

    }

}

createSnakeBody();
createSnakeBody();
createFood();

//controls
document.addEventListener("keydown", (event) => {

    let code = event.code;

    if (code === "KeyW" && direction !== "down") {
        direction = "up";
        return;
    }

    if (code === "KeyS" && direction !== "up") {
        direction = "down";
        return;
    }

    if (code === "KeyA" && direction !== "right") {
        direction = "left";
        return;
    }

    if (code === "KeyD" && direction !== "left") {
        direction = "right";
        return;
    }

});

function game() {

    let obj = setCord();

    snakeBody[snakeBody.length - 1].x = obj.x;
    snakeBody[snakeBody.length - 1].y = obj.y;

    snakeBody[snakeBody.length - 1].$el.style.left = obj.x + "px";
    snakeBody[snakeBody.length - 1].$el.style.top = obj.y + "px";

    gameOver(snakeBody[snakeBody.length - 1]);

    let last = snakeBody.pop();
    last.$el.classList.add("snake-rect-first");
    snakeBody[0].$el.classList.remove("snake-rect-first");
    snakeBody.unshift(last);

    eatFood();

}

function gameOver(first) {

    for (let elem of snakeBody) {

        if ((first.x === elem.x && first.y === elem.y) && first !== elem) {
            clearInterval(gameInterval);
            openModal();
        }

    }

}

function createFood() {
    let food = document.createElement("div");
    food.className = "food";
    food.style.background = `url("${randomFood()}") no-repeat center center`;
    food.style.backgroundSize = "100% 100%";
    $box.append(food);

    cordsFood = new Food();

    food.style.left = cordsFood.x + "px";
    food.style.top = cordsFood.y + "px";

}

function removeFoodUseless() {

    uselessTimeout = setTimeout( () => {

        if (eatedUseless) {
            removeFood();
            createFood();
        }

    }, 6000 );

}

function randomFood() {

    let foodIndex = Math.floor(Math.random() * arrayFood.length);

    if (arrayFood[foodIndex] === arrFoodUsefull) {

        let randomFood = Math.floor(Math.random() * arrFoodUsefull.length);
        eatedFood = "usefull";
        clearTimeout(uselessTimeout);
        return arrFoodUsefull[randomFood];

    } else {

        let randomFood = Math.floor(Math.random() * arrFoodUseless.length);
        eatedFood = "useless";
        clearTimeout(uselessTimeout);
        eatedUseless = true;
        removeFoodUseless();
        return arrFoodUseless[randomFood];

    }

}

function removeFood() {
    let food = $box.querySelector(".food");
    food.classList.add("food_collect");

    setTimeout(() => food.remove(), 900);

}

function createSnakeBody() {

    let rect = document.createElement("div");
    rect.className = `snake-rect ${indexEl}`;
    rect.setAttribute("data-number", indexEl);
    $box.append(rect);

    let x;
    let y;

    if (snakeBody.length === 0) {
        x = 40;
        y = 40;
        rect.style.left = x + "px";
        rect.style.top = y + "px";
    } else {
        let obj = setCord();
        x = obj.x;
        y = obj.y;
        rect.style.left = x + "px";
        rect.style.top = y + "px";
    }

    rect = $box.querySelector(`[data-number="${indexEl}"]`);
    let rectObj = new Snake(x, y, rect);
    snakeBody.unshift(rectObj);
    indexEl++;

    setTimeout(() => rect.classList.remove("snake-rect-first"), 100);
    
}

function setCord() {

    let objCord = {};

    if (direction === "up") {
        objCord.x = snakeBody[0].x;

        if (snakeBody[0].y - snakeSize < 0) {
            objCord.y = $box.offsetHeight - snakeSize;
        } else {
            objCord.y = snakeBody[0].y - snakeSize;
        }

        return objCord;
    }

    if (direction === "down") {
        objCord.x = snakeBody[0].x;

        if (snakeBody[0].y + snakeSize > $box.offsetHeight) {
            objCord.y = 0;
        } else {
            objCord.y = snakeBody[0].y + snakeSize;
        }

        return objCord;
    }

    if (direction === "left") {
        objCord.y = snakeBody[0].y;

        if (snakeBody[0].x - snakeSize < 0) {
            objCord.x = $box.offsetWidth - snakeSize;
        } else {
            objCord.x = snakeBody[0].x - snakeSize;
        }

        return objCord;
    }

    if (direction === "right") {
        objCord.y = snakeBody[0].y;

        if (snakeBody[0].x + snakeSize > $box.offsetWidth) {
            objCord.x = 0;
        } else {
            objCord.x = snakeBody[0].x + snakeSize;
        }

        return objCord;
    }

}

function eatFood() {

    let xSnake = snakeBody[0].x;
    let ySnake = snakeBody[0].y;

    let xFood = cordsFood.x;
    let yFood = cordsFood.y;

    if (xSnake === xFood && ySnake === yFood) {

        if (eatedFood === "usefull") {
            snakeSpeed = 160;
        } else {
            snakeSpeed -= 20;
            eatedUseless = false;
        }

        createSnakeBody();
        removeFood();
        createFood();

        clearInterval(gameInterval);
        gameInterval = setInterval(game, snakeSpeed);

        $scoreIndex.textContent = ++score;

    }

}

//interface
$overlay.addEventListener("click", closeModal);
$btnRestart.addEventListener("click", restartGame);
$box.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    $btnRestartManual.classList.toggle("btn-restart-manual_active");
});

$btnRestartManual.addEventListener("click", restartGame);
$getHelp.addEventListener("click", openHelp);

function openHelp() {
    $overlay.classList.add("overlay_active");
    $helpBody.classList.add("help-body_active");
}

function restartGame() {

    $btnRestartManual.classList.remove("btn-restart-manual_active");
    removeFood();
    cordsFood = null;

    eatedFood = "usefull";
    snakeSpeed = 120;
    snakeBody.length = 0;
    indexEl = 0;
    score = 0;
    eatedUseless = true;
    direction = "down";
    $scoreIndex.textContent = 0;

    eraseElems();

    createSnakeBody();
    createSnakeBody();
    createFood();

    closeModal();

    gameInterval = setInterval(game, snakeSpeed);

}

function closeModal() {
    $modalGameOver.classList.remove("modal-game_active");
    $helpBody.classList.remove("help-body_active"); 
    $overlay.classList.remove("overlay_active");
}

function openModal() {
    $scoreModal.textContent = score;
    $modalGameOver.classList.add("modal-game_active");
    $overlay.classList.add("overlay_active");
}

function eraseElems() {

    let arrElems = $box.querySelectorAll(".snake-rect");

    for (let elem of arrElems) {
        elem.remove();
    }

}

gameInterval = setInterval(game, snakeSpeed);











