const appState = {
  rowsNumber: 15,
  columnsNumber: 9,
  cells: [],
  carMoveDelta: {
    x: 0,
    y: 0,  // -1, 0, 1
  },
  carPosition: [
    [5, 14],
    [3, 14],
    [4, 13],
    [3, 12],
    [5, 12],
    [4, 12],
    [4, 11],
  ],
  xPosition: 0,
  barrier: [],
  score: 0,
  highScore: 0,
  finish: false,
};

let finish, tick = 0, generateNumber = 0, startLocation = 0;
let move = 2;
const onDOMIsReady = () => {
  console.log("!!!");
  init();
}

const init = () => {
  document.querySelector("#play").addEventListener("click", onButtonPlayClicked);
}

const onButtonPlayClicked = () => {
  document.querySelector("#first_screen").classList.add('hidden')
  document.querySelector("#second_screen").classList.remove('hidden')
  document.querySelector("#third_screen").classList.add('hidden');
  console.log('Click button');
  initMoveEventListener();
  generateField();
  generateCar();
  gameLoop();
}

const generateField = () => {
  const field = document.querySelector("#f2");
  for (let rowIndex = 0; rowIndex < appState.rowsNumber; rowIndex++) {
    for (let columnIndex = 0; columnIndex < appState.columnsNumber; columnIndex++) {
      let div = document.createElement("div");
      div.classList.add('cell');
      div.id = `row-${rowIndex};column-${columnIndex}`
      field.appendChild(div);
      const cell = {
        rowIndex,
        columnIndex,
        element: div,
        isCar: false,
        isBarrier: false,
        beginOfBarrier: false,
        readyToMove: false,
      };
      appState.cells.push(cell);
    }
  }
}

const findCell = (x, y) => appState.cells.find((cell) => cell.columnIndex === x && cell.rowIndex === y);

const generateCar = () => {
  for (const [x, y] of appState.carPosition) {
    findCell(x, y).isCar = true;
  }
}

const moveCar = () => {
  const oldCarCells = appState.cells.filter((cell) => cell.isCar);
  const playerGoingToOutOfBounceInNextTick = appState.carMoveDelta.x !== 0 && oldCarCells.some((cell) => {
    if (appState.carMoveDelta.x < 0 && cell.columnIndex === 0) return true;
    if (appState.carMoveDelta.x > 0 && cell.columnIndex === appState.columnsNumber - 1) return true;
  });

  if (playerGoingToOutOfBounceInNextTick) return;
  const newCarCells = [];

  for (const cell of oldCarCells) {
    cell.isCar = false;
    newCarCells.push(
      findCell(
        cell.columnIndex + appState.carMoveDelta.x,
        cell.rowIndex + appState.carMoveDelta.y,
      ),
    );
  }
  for (const cell of newCarCells) {
    cell.isCar = true;
  }
  appState.carMoveDelta.x = 0;
}

const moveBarrier = () => {
  const oldBarrierCells = appState.barrier.filter((barrier) => barrier.readyToMove);
  const newBarrierCells = [];
  if (tick === 0) {
    for (const cell of oldBarrierCells) {
      findCell(cell.columnIndex, 0).isBarrier = true;
    }
  } else {
    for (const cell of oldBarrierCells) {

      if (cell.rowIndex === appState.rowsNumber - 1) {
        cell.isBarrier = false;
        cell.readyToMove = false;

      }
      if (cell.rowIndex === 1) { findCell(cell.columnIndex, cell.rowIndex - 1).isBarrier = false; }
    }

    for (const cell of oldBarrierCells) {
      if (cell.rowIndex < appState.rowsNumber - 1) {

        cell.isBarrier = false;
        cell.readyToMove = false;
        newBarrierCells.push(
          findCell(cell.columnIndex, cell.rowIndex + 1))
      }
      for (const cell of newBarrierCells) {
        cell.isBarrier = true;
        cell.readyToMove = true;
      }

    }
  }
  appState.barrier = appState.cells.filter((cell) => cell.isBarrier);
}

const render = () => {
  for (const cell of appState.cells) {
    if (cell.isCar) {
      cell.element.classList.remove('cell');
      cell.element.classList.add('cell_car');
    } else {
      cell.element.classList.remove('cell_car');
      cell.element.classList.add('cell');
    }
    for (const cell of appState.cells) {
      if (cell.isBarrier) {
        cell.element.classList.remove('cell');
        cell.element.classList.add('cell_barrier');
      } else {
        cell.element.classList.remove('cell_barrier');
        cell.element.classList.add('cell');
      }
    }
  }
}

const gameLoop = () => {

  console.log('GAME_LOOP_TICK');
  moveCar();
  render();
  buildBarrier();
  moveBarrier();
  lose();
  setTimeout(gameLoop, 1000 / Math.sqrt(Math.sqrt(tick)));
  tick += 1;
}
const main = () => {
  if (document.readyState === 'complete') onDOMIsReady();
  else {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') onDOMIsReady();
    });
  }
};

const initMoveEventListener = () => {
  window.addEventListener('keyup', function (event) {
    if (appState.xPosition < 3) {
      if (event.code === 'KeyD') {
        appState.carMoveDelta.x = 0;
        appState.carMoveDelta.x = appState.carMoveDelta.x + 1;
        appState.xPosition = 1;
        move = 0;
      }
    }
    if (appState.xPosition > -3) {
      if (event.code === 'KeyA') {
        appState.carMoveDelta.x = 0;
        appState.carMoveDelta.x = appState.carMoveDelta.x - 1
        appState.xPosition = -1;
        move = 1;
      }
    }

  })
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const buildBarrier = () => {
  freeFirstRow = true;
  if (tick % 5 === 0) {
    generateNumber = getRandomInt(1, 3);
    for (let x = 0; x < 8; x++) {
      if (findCell(x, 0).isBarrier === true)
        freeFirstRow = false;
    }
  }

  if (generateNumber === 3) {
    if (freeFirstRow && (tick % 5) === 0) {
      startLocation = getRandomInt(0, 7);
      console.log(startLocation);
      findCell(startLocation, 0).isBarrier = true;
      findCell(startLocation, 0).beginOfBarrier = true;
      console.log(findCell(startLocation, 0).beginOfBarrier);
      findCell(startLocation + 1, 0).isBarrier = true;

    }
  } else {
    if (freeFirstRow && (tick % 5 === 0)) {
      startLocation = getRandomInt(0, 8);
      console.log(startLocation);
      findCell(startLocation, 0);
      findCell(startLocation, 0).isBarrier = true;
      findCell(startLocation, 0).readyToMove = true;
      findCell(startLocation, 0).beginOfBarrier = true;
    }
  }

  if ((tick % 5 === 1) && generateNumber === 3) {
    const barriers = appState.barrier.filter((cell) => cell.beginOfBarrier);
    const cell = barriers[0];
    cell.beginOfBarrier = false;
    cell.isBarrier = false;
    findCell(cell.columnIndex, cell.rowIndex + 1).isBarrier = false;
    findCell(cell.columnIndex, cell.rowIndex + 1).isBarrier = true;
    findCell(cell.columnIndex + 1, cell.rowIndex + 1).isBarrier = true;
    findCell(cell.columnIndex, cell.rowIndex).isBarrier = true;
    findCell(cell.columnIndex + 1, cell.rowIndex).isBarrier = true;
    findCell(cell.columnIndex, cell.rowIndex + 1).readyToMove = true;
    findCell(cell.columnIndex + 1, cell.rowIndex + 1).readyToMove = true;
    findCell(cell.columnIndex, cell.rowIndex).readyToMove = true;
    findCell(cell.columnIndex + 1, cell.rowIndex).readyToMove = true;
  }
  appState.barrier = appState.cells.filter((cell) => cell.isBarrier);

}

const lose = () => {

  const crush = appState.cells.filter((cell) => cell.isCar);
  for (const cell of crush) {
    if (cell.element.classList.contains('cell_barrier')) {

      console.log('YOU ARE LOOOOSEEEER!!!')
      document.querySelector("#second_screen").classList.add('hidden');
      document.querySelector("#third_screen").classList.remove('hidden');
      document.querySelector("#lose").addEventListener("click", restartGame);
      console.log(appState.score, 'LOL')
      playerScore();
    }
  }

}

const restartGame = () => {
  document.querySelector("#third_screen").classList.add('hidden');
  document.querySelector("#first_screen").classList.remove('hidden');
  document.querySelector("#second_screen").classList.add('hidden');
  window.location.reload();
}
const playerScore = () => {
  if (!appState.finish) {
    appState.finish = true;
    appState.score = Math.floor(tick / 5);
    document.getElementById("score").innerHTML = appState.score;
    appState.highScore = Number(localStorage.getItem('highScore'));
    document.getElementById("highScore").innerHTML = appState.highScore;
    if (appState.score > appState.highScore) {
      appState.highScore = appState.score
      localStorage.setItem('highScore', appState.highScore)
    }

  }
}
main();