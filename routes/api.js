const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.post("/api/check", (req, res) => {
    const { puzzleString, row, column, value } = req.body;

    console.log("--- Request: /api/check");
    console.log("Request Body:", req.body);

    // Check for missing puzzleString
    if (!puzzleString) {
      console.log("Invalid request body: puzzleString is missing");
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      // Validate remaining properties after puzzleString exists
      if (!row || !column || !value) {
        console.log("Invalid request body: row, column, or value is missing");
        return res.status(400).json({ error: "Invalid request body" });
      }

      console.log("Parameters:", { puzzleString, row, column, value });

      if (value < 1 || value > 9) {
        console.log("Invalid value:", value);
        return res
          .status(400)
          .json({ error: "Invalid value (must be between 1 and 9)" });
      }

      const hasRowConflict = solver.checkRowPlacement(
        puzzleString,
        row,
        column,
        value
      );
      const hasColConflict = solver.checkColPlacement(
        puzzleString,
        row,
        column,
        value
      );
      const hasRegionConflict = solver.checkRegionPlacement(
        puzzleString,
        row,
        column,
        value
      );

      console.log("--- Response: /api/check");
      console.log("Response Body:", {
        conflict: { hasColConflict, hasRegionConflict, hasRowConflict },
      });

      res.json({
        conflict: { hasColConflict, hasRegionConflict, hasRowConflict },
      });
    } catch (error) {
      console.error("Error checking placement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.route("/api/solve").post((req, res) => {
    console.log("--- Request: /api/solve");
    console.log("Request Body:", req.body);

    const { puzzleString } = req.body;

    if (!puzzleString) {
      console.log("Invalid request body: puzzleString is missing");
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      console.log("Puzzle String:", puzzleString);

      const solvedPuzzle = solver.solve(puzzleString);
      if (solvedPuzzle) {
        console.log("--- Response: /api/solve (solved)");
        console.log("Response Body:", { solvedPuzzle });
        res.json({ solvedPuzzle });
      } else {
        console.log("--- Response: /api/solve (not solved)");
        console.log("Response Body:", { solved: false });
        res.json({ solved: false });
      }
    } catch (error) {
      console.error("Error solving puzzle:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
