class SudokuSolver {
  validate(puzzleString) {
    // Check if the length is exactly 81 characters
    if (puzzleString.length !== 81) {
      return false;
    }

    // Check if all characters are valid digits (1-9) or empty cells ('.')
    const validChars = new Set("123456789."); // Set of allowed characters
    for (const char of puzzleString) {
      if (!validChars.has(char)) {
        return false;
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (value < 1 || value > 9) {
      return false;
    }

    if (row < 0 || row > 8) {
      throw new Error("Invalid row value (must be between 0 and 8)");
    }

    console.log("Puzzle String:", puzzleString); // Log puzzle string
    console.log("Row Start Index:", row * 9);
    console.log("Row End Index:", row * 9 + 9);
    const rowString = puzzleString.slice(row * 9, row * 9 + 9);
    console.log("Row String:", rowString); // Log row string

    for (let c = 0; c < 9; c++) {
      if (c !== column && rowString[c] === value.toString()) {
        // Convert value to string for comparison
        return true;
      }
    }

    return false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (value < 1 || value > 9) {
      return false;
    }

    if (column < 0 || column > 8) {
      throw new Error("Invalid column value (must be between 0 and 8)");
    }

    const colValues = [];
    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleString[i * 9 + column]);
    }
    console.log("Column Values:", colValues); // Log column values

    for (const colValue of colValues) {
      if (colValue === value.toString()) {
        return true; // Change to false
      }
    }

    return false; // Change to true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (value < 1 || value > 9) {
      return false;
    }

    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(column / 3) * 3;

    const regionString = [];
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        regionString.push(puzzleString[i * 9 + j]);
      }
    }
    console.log("Region String:", regionString); // Log region string

    return regionString.includes(value.toString()); // Change to !regionString.includes(value.toString())
  }

  solve(puzzleString) {
    // Check for invalid puzzle string length (should be 81 characters)
    if (puzzleString.length !== 81) {
      return false;
    }

    // Loop through each cell in the puzzle string
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = puzzleString[row * 9 + col];

        // Skip empty cells ('.')
        if (cellValue === ".") {
          continue;
        }

        // Convert cell value to number
        const value = parseInt(cellValue, 10);

        // Check for conflicts in the row, column, and subgrid
        if (
          !this.checkRowPlacement(puzzleString, row, col, value) ||
          !this.checkColPlacement(puzzleString, row, col, value) ||
          !this.checkRegionPlacement(puzzleString, row, col, value)
        ) {
          return false;
        }
      }
    }

    // If no conflicts found throughout the board, it's solved
    return true;
  }
}

module.exports = SudokuSolver;
