const wordle = [
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }],
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }],
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }],
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }],
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }],
  [{ value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }, { value: "", state: 0 }]
]
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
}

function toggleStatus() {
  let [cellRow, cellColumn] = this.id.split(",");
  if (this.classList.contains("filled") && !elementHasState(this)) {
    this.classList.add("absent");
    wordle[cellRow][cellColumn].state = 1
  } else if (this.classList.contains("absent")) {
    this.classList.replace("absent", "present");
    wordle[cellRow][cellColumn].state = 2
  } else if (this.classList.contains("present")) {
    this.classList.replace("present", "correct");
    wordle[cellRow][cellColumn].state = 3
  } else if (this.classList.contains("correct")) {
    this.classList.replace("correct", "absent");
    wordle[cellRow][cellColumn].state = 1
  }
}

function elementHasState(element) {
  return element.classList.contains("absent") || element.classList.contains("present") || element.classList.contains("correct");
}

function addLetterToBoard(letter) {
  let activeCell = document.getElementById(activeRow + "," + activeColumn);
  activeCell.innerHTML = letter;
  activeCell.classList.add("filled");
  wordle[activeRow][activeColumn].value = letter;
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
  wordle[activeRow][activeColumn].value = "";
  wordle[activeRow][activeColumn].state = 0;
}

 function addWordToBoard() {
  activeRow++;
  activeColumn = 0;
  callWordleHelper();
}

function isCompleteWord(word) {
  for (let index = 0; index < word.length; index++) {
    if (word[index].value == "" || word[index].state == 0) {
      return false;
    }
  }
  return true;
}

function addWordToWordle(word, wordle, index) {
  wordle.board[index] = "";
  wordle.state[index] = ""
  word.forEach(letter => {
    wordle.board[index] += letter.value.toLowerCase();
    wordle.state[index] += letter.state-1;
  });
}

async function callWordleHelper() {
  let currentWordle = {
    board: [],
    state: []
  };
  for (let index = 0; index < wordle.length; index++) {
    if (isCompleteWord(wordle[index])) {
      addWordToWordle(wordle[index], currentWordle, index);
    } else {
      break;
    }
  }
  possibleSolutions = await main(currentWordle);
  document.getElementById("solutions-box").innerHTML = possibleSolutions.join("\n");
}