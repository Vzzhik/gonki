const appState = {
  cells: [],
};

const onDOMIsReady = () => {
  
  const a = "a";
  const b = 3;
  const c = a+b;
  console.log("#" + c);
  init();
}

const init = () => {
  document.querySelector("#play").addEventListener("click", onButtonPlayClicked);
}

const onButtonPlayClicked = () => {
  document.querySelector("#first_screen").classList.add('hidden')
  document.querySelector("#second_screen").classList.remove('hidden')
  console.log('Click button');
  generateField();
}

const generateField = () => {
  const field = document.querySelector("#f2");
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 15; columnIndex++) {
        let div = document.createElement("div");
        div.classList.add('cell');
        const id = 15 * rowIndex + columnIndex;
        div.id = 'c' + id;
        field.appendChild(div);
        const cell = {
          rowIndex,
          columnIndex,
          element: div,
        };
        appState.cells.push(cell);
      }
    }
      

  // appState.cells.find((cell) => cell.rowIndex === 5 && cell.columnIndex === 2);
  generateCar();
}

const generateCar = () => {
  const FindCell = appState.cells.find((cell) => cell.columnIndex === 3 && cell.rowIndex === 8);
  let id = 9 * FindCell.rowIndex + FindCell.columnIndex;
  id = String(id);
  const div = document.querySelector("#c" + id);
  div.classList.remove('cell');
  div.classList.add('cell_car');
}

const main = () => {
  if (document.readyState === 'complete') onDOMIsReady();
  else {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') onDOMIsReady();
    });
  }
};



main();