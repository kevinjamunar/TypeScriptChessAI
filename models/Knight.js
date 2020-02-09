"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Piece_1 = require("./Piece");
/**
 * Knight Class
 */
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function Knight(isWhite, isPresent) {
        return _super.call(this, isWhite, isPresent, 'Knight') || this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    Knight.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
        //make sure the piece at the end cell is either null or a different color from the start piece.
        if (endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())) {
            var xStart = startCell.getX(); //row value
            var yStart = startCell.getY(); //column value
            if (this.endCellMatch(xStart - 2, yStart + 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart - 1, yStart + 2, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart - 2, yStart - 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart - 1, yStart - 2, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 1, yStart - 2, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 2, yStart - 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 2, yStart + 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 1, yStart + 2, endCell)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Determines if the endCell matches a valid position for a Knight on the board.
     * @param {number} x a valid row position for a Knight.
     * @param {number} y a valid column position for a Knight.
     * @param {Cell} endCell Destination position of the Cell.
     * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
     */
    Knight.prototype.endCellMatch = function (x, y, endCell) {
        if (x === endCell.getX() && y === endCell.getY()) {
            return true;
        }
        return false;
    };
    return Knight;
}(Piece_1.Piece));
exports.Knight = Knight;
