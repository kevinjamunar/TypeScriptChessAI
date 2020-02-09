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
 * Queen Class
 */
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function Queen(isWhite, isPresent) {
        return _super.call(this, isWhite, isPresent, 'Queen') || this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    Queen.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
        //make sure the piece at the end cell is either null or a different color from the start piece.
        if (endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())) {
            var xStart = startCell.getX(); //row value
            var yStart = startCell.getY(); //column value
            var MIN = 0;
            var MAX = 7;
            var xCurrent = xStart;
            var yCurrent = yStart;
            //Diagonal Checks
            for (var i = MIN; i <= MAX; i++) {
                xCurrent -= 1;
                yCurrent += 1;
                if (this.endCellMatch(xCurrent, yCurrent, endCell)) {
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for (var i = MIN; i <= MAX; i++) {
                xCurrent -= 1;
                yCurrent -= 1;
                if (this.endCellMatch(xCurrent, yCurrent, endCell)) {
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for (var i = MIN; i <= MAX; i++) {
                xCurrent += 1;
                yCurrent -= 1;
                if (this.endCellMatch(xCurrent, yCurrent, endCell)) {
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for (var i = MIN; i <= MAX; i++) {
                xCurrent += 1;
                yCurrent += 1;
                if (this.endCellMatch(xCurrent, yCurrent, endCell)) {
                    return true;
                }
            }
            //Perpendicular Checks
            if (startCell.getX() === endCell.getX()) {
                return true;
            }
            if (startCell.getY() === endCell.getY()) {
                return true;
            }
        }
        return false;
    };
    /**
    * Determines if the endCell matches a valid position for a Queen on the board.
    * @param {number} x a valid row position for a Queen.
    * @param {number} y a valid column position for a Queen.
    * @param {Cell} endCell Destination position of the Cell.
    * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
    */
    Queen.prototype.endCellMatch = function (x, y, endCell) {
        if (x === endCell.getX() && y === endCell.getY()) {
            return true;
        }
        return false;
    };
    return Queen;
}(Piece_1.Piece));
exports.Queen = Queen;
