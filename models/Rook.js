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
 * Rook Class
 */
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function Rook(isWhite, isPresent) {
        var _this = _super.call(this, isWhite, isPresent, 'Rook') || this;
        _this.isFirstMove = true;
        return _this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    Rook.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
        //make sure the piece at the end cell is either null or a different color from the start piece.
        if (endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())) {
            //same row
            if (startCell.getX() === endCell.getX()) {
                return true;
            }
            //same column
            if (startCell.getY() === endCell.getY()) {
                return true;
            }
        }
        return false;
    };
    return Rook;
}(Piece_1.Piece));
exports.Rook = Rook;
