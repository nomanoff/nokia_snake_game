let canvas = document.getElementById("canvas");

let ROWS = 30;
let COLS = 50;
let PIXEL = 10;
let pixels = new Map();
let moveRight = ([t, l]) => [t, l + 1];
let moveLeft = ([t, l]) => [t, l - 1];
let moveUp = ([t, l]) => [t - 1, l];
let moveDown = ([t, l]) => [t + 1, l];

function initializeCanvas() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let pixel = document.createElement("div");
      pixel.style.position = "absolute";
      pixel.style.border = "1px solid #aaa";
      pixel.style.left = j * PIXEL + "px";
      pixel.style.top = i * PIXEL + "px";
      pixel.style.height = PIXEL + "px";
      pixel.style.width = PIXEL + "px";

      let key = toKey([i, j]);

      canvas.appendChild(pixel);

      pixels.set(key, pixel);
    }
  }
}

initializeCanvas();

function drawCanvas() {
  let foodKey = toKey(currentFood);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let key = toKey([i, j]);
      let pixel = pixels.get(key);

      let background = "white";
      if (key === foodKey) {
        background = "purple";
      } else if (currentSnakeKeys.has(key)) {
        background = "black";
      }
      pixel.style.background = background;
    }
  }
}

let currentSnake;
let currentSnakeKeys;
let currentFood;
let currentDirection;
let directionQueue;

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
    case "A":
    case "a":
      directionQueue.push(moveLeft);
      break;
    case "ArrowRight":
    case "D":
    case "d":
      directionQueue.push(moveRight);
      break;
    case "ArrowUp":
    case "W":
    case "w":
      directionQueue.push(moveUp);
      break;
    case "ArrowDown":
    case "S":
    case "s":
      directionQueue.push(moveDown);
      break;
    case "R":
    case "r":
      stopGame();
      startGame();
      break;
  }
  // dump(directionQueue);
});

function step() {
  let head = currentSnake[currentSnake.length - 1];
  let nextDirection = currentDirection;
  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();
    if (!areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;
      break;
    }
  }
  currentDirection = nextDirection;
  let nextHead = currentDirection(head);
  if (!checkValidHead(currentSnakeKeys, nextHead)) {
    stopGame();
    return;
  }
  currentSnake.push(nextHead);
  if (toKey(nextHead) === toKey(currentFood)) {
    currentFood = spawnFood();
  } else {
    currentSnake.shift();
  }
  currentSnakeKeys = toKeySet(currentSnake);
  drawCanvas();
  // dump(directionQueue);
}

function spawnFood() {
  let nextTop = Math.floor(Math.random() * ROWS);
  let nextLeft = Math.floor(Math.random() * COLS);
  return [nextTop, nextLeft];
}

function areOpposite(dir1, dir2) {
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }
  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  }
  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }
  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }
  return false;
}

function checkValidHead(keys, cell) {
  let [top, left] = cell;
  if (top < 0 || left < 0) {
    return false;
  }
  if (top >= ROWS || left >= COLS) {
    return false;
  }

  if (keys.has(toKey(cell))) {
    return false;
  }
  return true;
}

function stopGame() {
  canvas.style.borderColor = "red";
  clearInterval(gameInterval);
}

function startGame() {
  directionQueue = [];
  currentDirection = moveRight;
  currentSnake = makeInitialSnake();
  currentSnakeKeys = toKeySet(currentSnake);
  currentFood = spawnFood();

  canvas.style.borderColor = "";
  gameInterval = setInterval(step, 100);
  drawCanvas();
}

startGame();

function makeInitialSnake() {
  return [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ];
}

function toKey([top, left]) {
  return top + "_" + left;
}

function toKeySet(snake) {
  let set = new Set();
  for (let cell of snake) {
    let position = toKey(cell);
    set.add(position);
  }
  return set;
}

// function dump(queue) {
//   document.getElementById("debug").innerText = queue
//     .map((fn) => fn.name)
//     .join(", ");
// }
function dump2(obj) {
  document.getElementById("debug").innerText = JSON.stringify(obj);
}
