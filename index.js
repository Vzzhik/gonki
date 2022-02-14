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
  ]
};

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
  //ищем все ячейки которые машина
  const oldCarCells = appState.cells.filter((cell) => cell.isCar);
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
  // говорим старым ячейкам что они не машина
  // собираем их координаты
  // получаем новые координаты // + appState.carMoveDelta.x
  // ищем новые ячейки
  // говорим новым ячейкам что они машина
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
  }
}

const gameLoop = () => {
  console.log('GAME_LOOP_TICK');
  moveCar();
  render();
  setTimeout(gameLoop, 1000);

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
  window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyD') { ride = ride + 1; console.log(ride) }
    if (event.code === 'KeyA') { console.log(ride) }
  })
}


main();