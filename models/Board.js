"use strict";
exports.__esModule = true;
var Cell_1 = require("./Cell");
var Pawn_1 = require("./Pawn");
var Rook_1 = require("./Rook");
var Knight_1 = require("./Knight");
var Bishop_1 = require("./Bishop");
var Queen_1 = require("./Queen");
var King_1 = require("./King");
var Board = /** @class */ (function () {
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     */
    function Board(isBottomWhite) {
        this.isBottomWhite = isBottomWhite;
        this.MAX_LENGTH = 8;
        this.boardCells = [];
        for (var row = 0; row < this.MAX_LENGTH; row++) {
            this.boardCells[row] = [];
            for (var col = 0; col < this.MAX_LENGTH; col++) {
                this.boardCells[row][col] = new Cell_1.Cell(null, row, col);
            }
        }
    }
    /**
    * Initializes the bottom of the board with all 16 pieces.
    */
    Board.prototype.initializeBoardBottom = function () {
        this.isBottomWhite ? this.addPieces(6, 7, true) : this.addPieces(6, 7, false);
    };
    /**
     * Initializes the top of the board with all 16 pieces.
     */
    Board.prototype.initializeBoardTop = function () {
        this.isBottomWhite ? this.addPieces(1, 0, false) : this.addPieces(1, 0, true);
    };
    /**
    * Adds initial placement of 16 chess pieces to the board.
    *
    * @param {number} rowFront The index of the row for pawn placements
    * @param {number} rowBack The index of the row for non-pawn placements
    * @param {boolean} isWhite True if the color of pieces is white, false otherwise.
    */
    Board.prototype.addPieces = function (rowFront, rowBack, isWhite) {
        for (var col = 0; col < this.MAX_LENGTH; col++) {
            this.boardCells[rowFront][col].setPiece(new Pawn_1.Pawn(isWhite, true, rowFront === 6 ? true : false));
        }
        this.boardCells[rowBack][0].setPiece(new Rook_1.Rook(isWhite, true));
        this.boardCells[rowBack][7].setPiece(new Rook_1.Rook(isWhite, true));
        this.boardCells[rowBack][1].setPiece(new Knight_1.Knight(isWhite, true));
        this.boardCells[rowBack][6].setPiece(new Knight_1.Knight(isWhite, true));
        this.boardCells[rowBack][2].setPiece(new Bishop_1.Bishop(isWhite, true));
        this.boardCells[rowBack][5].setPiece(new Bishop_1.Bishop(isWhite, true));
        this.boardCells[rowBack][3].setPiece(new Queen_1.Queen(isWhite, true));
        this.boardCells[rowBack][4].setPiece(new King_1.King(isWhite, true));
    };
    /**
     * Prints the Chess Pieces on the board.
     */
    Board.prototype.printPiecesTest = function () {
        var cells = this.boardCells;
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                console.log(this.boardCells[row][col].getPiece());
            }
        }
    };
    return Board;
}());
exports.Board = Board;
