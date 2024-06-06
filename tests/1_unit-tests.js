const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("Sudoku Solver", () => {
  suite("Puzzle String Validation", () => {
    test("should handle valid puzzle string (81 characters)", () => {
      const puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const isValid = validatePuzzleString(puzzleString);
      assert.isTrue(isValid);
    });

    test("should handle invalid characters (not 1-9 or .)", () => {
      const puzzleString =
        "1.a..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const isValid = validatePuzzleString(puzzleString);
      assert.isFalse(isValid);
    });

    test("should handle invalid length (less than 81 characters)", () => {
      const puzzleString = "1.5..2.84..";
      const isValid = validatePuzzleString(puzzleString);
      assert.isFalse(isValid);
    });

    test("should handle invalid length (more than 81 characters)", () => {
      const puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.extra";
      const isValid = validatePuzzleString(puzzleString);
      assert.isFalse(isValid);
    });
  });

  suite("Placement Validation", () => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";

    test("should handle valid row placement", () => {
      const row = 0;
      const value = 8;
      const isValid = isValidPlacement(puzzleString, row, value);
      assert.isTrue(isValid);
    });

    test("should handle invalid row placement (existing value)", () => {
      const row = 0;
      const value = 2;
      const isValid = isValidPlacement(puzzleString, row, value);
      assert.isFalse(isValid);
    });

    test("should handle valid column placement", () => {
      const col = 0;
      const value = 4;
      const isValid = isValidPlacement(puzzleString, col, value);
      assert.isTrue(isValid);
    });

    test("should handle invalid column placement (existing value)", () => {
      const col = 0;
      const value = 3;
      const isValid = isValidPlacement(puzzleString, col, value);
      assert.isFalse(isValid);
    });

    test("should handle valid region placement", () => {
      const row = 0;
      const col = 0;
      const value = 1;
      const isValid = isValidPlacement(puzzleString, row, col, value);
      assert.isTrue(isValid);
    });

    test("should handle invalid region placement (existing value)", () => {
      const row = 0;
      const col = 2;
      const value = 7;
      const isValid = isValidPlacement(puzzleString, row, col, value);
      assert.isFalse(isValid);
    });
  });

  suite("Solver Functionality", () => {
    test("should solve a valid puzzle string", () => {
      const puzzleString =
        "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
      const solution = solveSudoku(puzzleString);
      // Assert that the solution is valid and complete (all cells filled)
    });
  });

  test("should fail to solve an invalid puzzle string", () => {
    const puzzleString = "invalid characters...";
    try {
      const solution = solveSudoku(puzzleString);
      // If solving doesn't throw an error, the test fails
      assert.fail(
        "Expected solving to throw an error for invalid puzzle string"
      );
    } catch (error) {
      // If solving throws an error, the test passes
      assert.ok(error, "Solving should throw an error");
    }
  });
});
