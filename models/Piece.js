"use strict";
exports.__esModule = true;
/**
 * Creates a new Piece
 * @param {boolean} isWhite Set true if white and false otherwise
 * @param {boolean} isPresent Set true if a Piece is on the board and false otherwise
 */
var Piece = /** @class */ (function () {
    /**
     *
     * @param {boolean} isWhite True if Piece white, False otherwise
     * @param {boolean} isPresent True if Piece in on the board, False otherwise
     */
    function Piece(isWhite, isPresent, type) {
        this.isWhite = isWhite;
        this.isPresent = isPresent;
        this.type = type;
    }
    /**
     * @return {boolean} True if Piece is white, False otherwise.
     */
    Piece.prototype.getIsWhite = function () {
        return this.isWhite;
    };
    /**
     * @return {boolean} True if cell is on board, False otherwise.
     */
    Piece.prototype.getIsPresent = function () {
        return this.isPresent;
    };
    /**
     * @return {string} The type of the piece.
     */
    Piece.prototype.getType = function () {
        return this.type;
    };
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     */
    Piece.prototype.setIsWhite = function (isWhite) {
        this.isWhite = isWhite;
    };
    /**
     *
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    Piece.prototype.setIsPresent = function (isPresent) {
        this.isPresent = isPresent;
    };
    return Piece;
}());
exports.Piece = Piece;
