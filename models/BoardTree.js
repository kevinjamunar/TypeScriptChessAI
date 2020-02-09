"use strict";
exports.__esModule = true;
var BoardTree = /** @class */ (function () {
    function BoardTree(parent, currentBoard, children) {
        this.parent = parent;
        this.currentBoard = currentBoard;
        this.children = children;
        this.staticEvaluation = 0;
        this.isCheck = false;
        this.isCheckmate = false;
        this.isStalemate = false;
        this.prevBoard = null;
        this.startCell = null;
        this.endCell = null;
        this.startPiece = null;
        this.endPiece = null;
        this.canEnPassant = false;
        this.lowestStaticEvaluation = 10000000;
        this.highestStaticEvaluation = -10000000;
    }
    /**
     * GETTERS
     */
    BoardTree.prototype.getParent = function () {
        return this.parent;
    };
    BoardTree.prototype.getCurrentBoard = function () {
        return this.currentBoard;
    };
    BoardTree.prototype.getChildren = function () {
        return this.children;
    };
    BoardTree.prototype.getStaticEvaluation = function () {
        return this.staticEvaluation;
    };
    BoardTree.prototype.getIsCheck = function () {
        return this.isCheck;
    };
    BoardTree.prototype.getIsCheckmate = function () {
        return this.isCheckmate;
    };
    BoardTree.prototype.getIsStalemate = function () {
        return this.isStalemate;
    };
    BoardTree.prototype.getPrevBoard = function () {
        return this.prevBoard;
    };
    BoardTree.prototype.getStartCell = function () {
        return this.startCell;
    };
    BoardTree.prototype.getEndCell = function () {
        return this.endCell;
    };
    BoardTree.prototype.getStartPiece = function () {
        return this.startPiece;
    };
    BoardTree.prototype.getEndPiece = function () {
        return this.endPiece;
    };
    BoardTree.prototype.getEnPassant = function () {
        return this.canEnPassant;
    };
    BoardTree.prototype.getLowestStaticEvaluation = function () {
        return this.lowestStaticEvaluation;
    };
    BoardTree.prototype.getHighestStaticEvaluation = function () {
        return this.highestStaticEvaluation;
    };
    /**
     * SETTERS
    */
    BoardTree.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    BoardTree.prototype.setCurrentBoard = function (currentBoard) {
        this.currentBoard = currentBoard;
    };
    BoardTree.prototype.setChildren = function (children) {
        this.children = children;
    };
    BoardTree.prototype.setStaticEvaluation = function (staticEvaluation) {
        this.staticEvaluation = staticEvaluation;
    };
    BoardTree.prototype.setIsCheck = function (isCheck) {
        this.isCheck = isCheck;
    };
    BoardTree.prototype.setIsCheckmate = function (isCheckmate) {
        this.isCheckmate = isCheckmate;
    };
    BoardTree.prototype.setIsStalemate = function (isStalemate) {
        this.isStalemate = isStalemate;
    };
    BoardTree.prototype.setPrevBoard = function (prevBoard) {
        this.prevBoard = prevBoard;
    };
    BoardTree.prototype.setStartCell = function (startCell) {
        this.startCell = startCell;
    };
    BoardTree.prototype.setEndCell = function (endCell) {
        this.endCell = endCell;
    };
    BoardTree.prototype.setStartPiece = function (startPiece) {
        this.startPiece = startPiece;
    };
    BoardTree.prototype.setEndPiece = function (endPiece) {
        this.endPiece = endPiece;
    };
    BoardTree.prototype.setEnPassant = function (canEnPassant) {
        this.canEnPassant = canEnPassant;
    };
    BoardTree.prototype.setLowestStaticEvaluation = function (lowestStaticEvaluation) {
        this.lowestStaticEvaluation = lowestStaticEvaluation;
    };
    BoardTree.prototype.setHighestStaticEvaluation = function (highestStaticEvaluation) {
        this.highestStaticEvaluation = highestStaticEvaluation;
    };
    /**
     * Adds child to the tree.
     *
     * @param {BoardTree} child Child of the currBoardTree
     *
     */
    BoardTree.prototype.addChildToTree = function (child) {
        this.children.push(child);
    };
    /**
     * Initializes the cells and pieces of the previous board.
     *
     * @param {Cell} startCell The cell of the piece before moving.
     * @param {Cell} endCell The cell of the piece after moving.
     * @param {Piece} startPiece The Piece located at the startCell.
     * @param {Piece} endPiece The Piece located at the endCell.
     *
     */
    BoardTree.prototype.initializeCellsAndPieces = function (startCell, endCell, startPiece, endPiece) {
        this.startCell = startCell;
        this.endCell = endCell;
        this.startPiece = startPiece;
        this.endPiece = endPiece;
    };
    return BoardTree;
}());
exports.BoardTree = BoardTree;
