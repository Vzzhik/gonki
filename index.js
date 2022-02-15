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
};

let tick = 0;
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
        isBarrier: false,
        beginOfBarrier:false,
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
    }else {
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
  setTimeout(gameLoop, 1000);
  tick+=1;
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
        appState.xPosition += 1;
      }
    }
    if (appState.xPosition > -3) {
      if (event.code === 'KeyA') {
        appState.carMoveDelta.x = 0;
        appState.carMoveDelta.x = appState.carMoveDelta.x - 1
        appState.xPosition -= 1;
      }
    }

  })
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

const buildBarrier = () => {
  freeFirstRow = true;
  if (tick === 0){
  for (let x = 0; x < 8; x++) {
    if (findCell(x, 0).isBarrier === true)
      freeFirstRow = false;
  }
  }
  if (freeFirstRow && tick === 0) {
    startLocation = getRandomInt(1, 7);
    console.log(startLocation);
     const cell = findCell(startLocation, 0);
    cell.isBarrier = true;
    cell.beginOfBarrier = true;
    
  }
    if (tick === 1) {
      const cell = appState.cells.filter((cell) => cell.beginOfBarrier);
      console.log(cell)
      cell[0].isBarrier = false;
      cell[0].beginOfBarrier = false;
      //cell[0].rowIndex+=1;
      //cell.beginOfBarrier = true;
      //cell.isBarrier = true;
      const newCell = findCell(cell[0].columnIndex, cell[0].rowIndex+1);
      newCell.isBarrier = true;
      newCell.beginOfBarrier = true;
      for ( let i = cell[0].columnIndex - 1; i < cell[0].columnIndex + 2; i ++) {
        findCell(i,cell[0].rowIndex).isBarrier = true;
      }
      
      
    
    }
    if (tick === 2) {

    } 
    if (tick === 3) {

    }
  
}



main();