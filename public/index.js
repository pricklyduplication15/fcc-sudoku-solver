const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");
const loadingIndicator = document.getElementById("loading-indicator");
let puzzleString = ""; // Change to let to allow reassignment

import puzzlesAndSolutions from "./public/puzzle-strings";

// Set the initial puzzle value and fill Sudoku grid
document.addEventListener("DOMContentLoaded", () => {
  setInitialPuzzleValue();
  fillSudokuGrid(textArea.value.trim());
});

// Event listener for text area input to trigger puzzle string update
textArea.addEventListener("input", updatePuzzleString);

// Function to set the initial puzzle string value in the textArea
function setInitialPuzzleValue() {
  const initialPuzzleString = puzzlesAndSolutions[0][0];
  textArea.value = initialPuzzleString;
}

// Function to fill the Sudoku grid based on the puzzle string
function fillSudokuGrid(puzzleString) {
  const cells = document.querySelectorAll(".sudoku-input");
  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = puzzleString.charAt(i);
  }
}

// Function to handle solve button click
async function handleSolve() {
  showLoadingIndicator();
  try {
    const response = await fetch("/api/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ puzzle: textArea.value }),
    });
    const data = await response.json();
    if (response.ok) {
      fillPuzzle(data.solvedPuzzle);
    } else {
      errorMsg.textContent = data.error || "Error solving puzzle";
    }
  } catch (error) {
    errorMsg.textContent = "Error solving puzzle";
    console.error("Error:", error);
  } finally {
    hideLoadingIndicator();
  }
}

// Function to handle check button click
async function handleCheck() {
  // Validation and other code here...
}

// Function to update the puzzle string based on user input
function updatePuzzleString() {
  puzzleString = textArea.value.trim();
  fillSudokuGrid(puzzleString);
}

// Event listeners for buttons
document.getElementById("solve-button").addEventListener("click", handleSolve);
document.getElementById("check-button").addEventListener("click", handleCheck);

// Function to show loading indicator
function showLoadingIndicator() {
  loadingIndicator.style.display = "block";
}

// Function to hide loading indicator
function hideLoadingIndicator() {
  loadingIndicator.style.display = "none";
}
