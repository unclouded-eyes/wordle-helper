const wordle = { board: [], state: [] };
var activeRow = 0;
var activeColumn = 0;

document.addEventListener("DOMContentLoaded", addCustomEventListeners())

function addCustomEventListeners() {
  document.onkeyup = handleInput;
  let cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.onclick = toggleStatus;
  });
}

function handleInput(event) {
  let letter = String.fromCharCode(event.keyCode);
  if (activeColumn < 5 && letter.match(/[A-Z]/)) {
    addLetterToBoard(letter);
  } else if (event.key == "Backspace" && activeColumn > 0) {
    removeLetterFromBoard();
  } else if (event.key == "Enter" && activeColumn == 5) {
    addWordToBoard();
  }
  console.log(wordle);
}

function toggleStatus() {
  if (this.classList.contains("filled") && !elementHasState(this)) this.classList.add("absent");
  else if (this.classList.contains("absent")) this.classList.replace("absent", "present");
  else if (this.classList.contains("present")) this.classList.replace("present", "correct");
  else if (this.classList.contains("correct")) this.classList.replace("correct", "absent");
}

function elementHasState(element) {
  return element.classList.contains("absent") || element.classList.contains("present") || element.classList.contains("correct");
}

function addLetterToBoard(letter) {
  let activeCell = document.getElementById(activeRow + "," + activeColumn);
  activeCell.innerHTML = letter;
  activeCell.classList.add("filled");
  if (activeColumn == 0) wordle.board[activeRow] = letter;
  else wordle.board[activeRow] += letter;
  activeColumn++;
}

function removeLetterFromBoard() {
  activeColumn--;
  let activeCell = document.getElementById(activeRow + "," + activeColumn);
  activeCell.innerHTML = "";
  activeCell.classList.remove("filled");
  activeCell.classList.remove("absent");
  activeCell.classList.remove("present");
  activeCell.classList.remove("correct");
  wordle.board[activeRow] = wordle.board[activeRow].slice(0, -1);
}

function addWordToBoard() {
  activeRow++;
  activeColumn = 0;
}