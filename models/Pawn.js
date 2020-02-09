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
 * Pawn Class
 */
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function Pawn(isWhite, isPresent, isMovingUp) {
        var _this = _super.call(this, isWhite, isPresent, 'Pawn') || this;
        _this.isFirstMove = true;
        _this.isMovingUp = isMovingUp;
        _this.movingTwoSpots = false;
        _this.isEnPassant = false;
        return _this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    Pawn.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
        //make sure the piece at the end cell is null
        var xStart = startCell.getX(); //row value
        var yStart = startCell.getY(); //column value
        //Pawn is moving for the first time
        if (this.isFirstMove) {
            if (this.isMovingUp) {
                if ((this.endCellMatch(xStart - 2, yStart, endCell) || this.endCellMatch(xStart - 1, yStart, endCell)) && endPiece === null) {
                    this.movingTwoSpots = true;
                    if (this.endCellMatch(xStart - 2, yStart, endCell)) {
                        this.isEnPassant = true;
                    }
                    return true;
                }
                if (this.endCellMatch(xStart - 1, yStart - 1, endCell) && endPiece !== null) {
                    return true;
                }
                if (this.endCellMatch(xStart - 1, yStart + 1, endCell) && endPiece !== null) {
                    return true;
                }
                return false;
            }
            else {
                if ((this.endCellMatch(xStart + 2, yStart, endCell) || this.endCellMatch(xStart + 1, yStart, endCell)) && endPiece === null) {
                    this.movingTwoSpots = true;
                    if (this.endCellMatch(xStart + 2, yStart, endCell)) {
                        this.isEnPassant = true;
                    }
                    return true;
                }
                if (this.endCellMatch(xStart + 1, yStart + 1, endCell) && endPiece !== null) {
                    return true;
                }
                if (this.endCellMatch(xStart + 1, yStart - 1, endCell) && endPiece !== null) {
                    return true;
                }
                return false;
            }
            //Pawn has already made its first move
        }
        else {
            if (this.isMovingUp) {
                if (this.endCellMatch(xStart - 1, yStart - 1, endCell) && endPiece !== null) {
                    this.isEnPassant = false;
                    return true;
                }
                if (this.endCellMatch(xStart - 1, yStart + 1, endCell) && endPiece !== null) {
                    this.isEnPassant = false;
                    return true;
                }
                if (this.endCellMatch(xStart - 1, yStart, endCell) && endPiece === null) {
                    this.isEnPassant = false;
                    return true;
                }
                return false;
            }
            else {
                if (this.endCellMatch(xStart + 1, yStart + 1, endCell) && endPiece !== null) {
                    this.isEnPassant = false;
                    return true;
                }
                if (this.endCellMatch(xStart + 1, yStart - 1, endCell) && endPiece !== null) {
                    this.isEnPassant = false;
                    return true;
                }
                if (this.endCellMatch(xStart + 1, yStart, endCell) && endPiece === null) {
                    this.isEnPassant = false;
                    return true;
                }
                return false;
            }
        }
    };
    /**
     * Determines if the endCell matches a valid position for a Pawn on the board.
     * @param {number} x a valid row position for a Pawn.
     * @param {number} y a valid column position for a Pawn.
     * @param {Cell} endCell Destination position of the Cell.
     * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
     */
    Pawn.prototype.endCellMatch = function (x, y, endCell) {
        if (x === endCell.getX() && y === endCell.getY()) {
            return true;
        }
        return false;
    };
    return Pawn;
}(Piece_1.Piece));
exports.Pawn = Pawn;
