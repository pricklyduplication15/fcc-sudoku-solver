const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../your-app-file"); // Replace with path to your app

suite("Solve API", () => {
  chai.use(chaiHttp);

  test("should solve a puzzle with valid puzzle string (POST /api/solve)", (done) => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
    chai
      .request(app)
      .post("/api/solve")
      .send({ puzzleString })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 200);
        assert.isObject(res.body); // Assert response is an object (solution)
        done();
      });
  });

  test("should handle missing puzzle string (POST /api/solve)", (done) => {
    chai
      .request(app)
      .post("/api/solve")
      .send({}) // No puzzleString in request body
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle invalid characters (POST /api/solve)", (done) => {
    const puzzleString = "invalid characters...";
    chai
      .request(app)
      .post("/api/solve")
      .send({ puzzleString })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle incorrect length (POST /api/solve)", (done) => {
    const puzzleString = "invalid length..."; // Less than 81 characters
    chai
      .request(app)
      .post("/api/solve")
      .send({ puzzleString })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle unsolvable puzzle (POST /api/solve)", (done) => {
    const puzzleString =
      "...X...X....1....9....8.....6.3.....4....8....1....2....6....7....5....."; // Invalid placement
    chai
      .request(app)
      .post("/api/solve")
      .send({ puzzleString })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 409); // Conflict (unsolvable)
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });
});

suite("Check Placement API", () => {
  chai.use(chaiHttp);

  test("should check placement with all fields (POST /api/check)", (done) => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
    const row = 0;
    const col = 0;
    const value = 8;
    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 200);
        assert.isObject(res.body); // Assert response is an object (validity)
        done();
      });
  });

  test("should handle single placement conflict (POST /api/check)", (done) => {
    const puzzleString =
      "...26..78...1....9....8.....6.3.....4....8....1....2....6....7....5....."; // Conflict in row 0 (value 8 already exists)
    const row = 0;
    const col = 1; // Placing 8 in conflicting cell
    const value = 8;

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 409); // Conflict
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle multiple placement conflicts (POST /api/check)", (done) => {
    const puzzleString =
      "...26..78...1....9....8.....6.3.....4....8....1....2....6....7....5....."; // Multiple conflicts
    const row = 1;
    const col = 2; // Placing 2 conflicts with row 1, col 1 and box
    const value = 2;

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 409); // Conflict
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle all placement conflicts (POST /api/check)", (done) => {
    const puzzleString = "888888888888888888888888888888888888888888"; // All cells filled with 8 (conflicts)
    const row = 0;
    const col = 0;
    const value = 1; // Any value will have conflicts

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 409); // Conflict
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle missing required fields (POST /api/check)", (done) => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString }) // Missing row, col, or value
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle invalid characters (POST /api/check)", (done) => {
    const puzzleString = "invalid characters...";
    const row = 0;
    const col = 0;
    const value = 8;

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle incorrect length (POST /api/check)", (done) => {
    const puzzleString = "invalid length..."; // Less than 81 characters
    const row = 0;
    const col = 0;
    const value = 8;

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle invalid placement coordinate (POST /api/check)", (done) => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
    const row = -1; // Invalid row (negative)
    const col = 0;
    const value = 8;

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });

  test("should handle invalid placement value (POST /api/check)", (done) => {
    const puzzleString =
      "...26..7....1....9....8.....6.3.....4....8....1....2....6....7....5.....";
    const row = 0;
    const col = 0;
    const value = 10; // Invalid value (greater than 9)

    chai
      .request(app)
      .post("/api/check")
      .send({ puzzleString, row, col, value })
      .end((err, res) => {
        assert.ifError(err);
        assert.equal(res.status, 400); // Bad request
        assert.isObject(res.body);
        assert.isString(res.body.error); // Assert error message exists
        done();
      });
  });
});
