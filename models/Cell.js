"use strict";
exports.__esModule = true;
/**
 * Creates a new Cell on the Board.
 */
var Cell = /** @class */ (function () {
    /**
     *
     * @param {Piece} piece Piece object associated with a given Cell object.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     */
    function Cell(piece, x, y) {
        this.piece = piece;
        this.x = x;
        this.y = y;
    }
    /**
     * @return {Piece} Piece object in the cell.
     */
    Cell.prototype.getPiece = function () {
        return this.piece;
    };
    /**
     * @return {number} Horizontal position for cell.
     */
    Cell.prototype.getX = function () {
        return this.x;
    };
    /**
     * @return {number} Vertical position for cell.
     */
    Cell.prototype.getY = function () {
        return this.y;
    };
    /**
     * Set the Piece object for the cell.
     * @param {Piece} piece Accept a Piece reference.
     */
    Cell.prototype.setPiece = function (piece) {
        this.piece = piece;
    };
    /**
     * Set the vertical position for the cell.
     * @param {number} x Vertical position for cell.
     */
    Cell.prototype.setX = function (x) {
        this.x = x;
    };
    /**
     * Set the horizontal position for the cell.
     * @param {number} y Horizontal position for cell.
     */
    Cell.prototype.setY = function (y) {
        this.y = y;
    };
    return Cell;
}());
exports.Cell = Cell;
