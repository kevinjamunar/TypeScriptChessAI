(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var gameView = require("../view/gameView");
var Board_1 = require("../models/Board");
var Game_1 = require("../models/Game");
var Quote_1 = require("../models/Quote");
/**
 * Quote Setup
 */
var quotes = [];
quotes.push(new Quote_1.Quote("<q cite=\"https://www.ichess.net/blog/chess-quotes/\">Even a poor plan is better than no plan at all.</q> - <cite> Mikhail Chigorin </cite> "));
quotes.push(new Quote_1.Quote("<q cite=\"https://www.ichess.net/blog/chess-quotes/\">Tactics is knowing what to do when there is something to do; strategy is knowing what to do when there is nothing to do.</q> - <cite> Savielly Tartakower </cite>"));
quotes.push(new Quote_1.Quote("<q cite=\"https://www.ichess.net/blog/chess-quotes/\">In life, as in chess, forethought wins.</q> - <cite> Charles Buxton </cite> "));
quotes.push(new Quote_1.Quote("<q>A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.</q> - <cite> Alan Turring </cite> "));
gameView.insertImagesForFastLoading();
setInterval(function () {
    var idx = Math.floor(Math.random() * quotes.length);
    gameView.setQuote(quotes[idx].getQuote());
}, 8000);
quotes.forEach(function (quote) {
    gameView.setQuote(quote.getQuote());
});
/**
 * Game Setup
 */
var MAX_LENGTH = 8;
var gameBoard = new Board_1.Board(true);
var game = new Game_1.Game(gameBoard);
var state = {
    isGamePlaying: true,
    firstMoveMade: false,
    isPlayerTurn: true,
    isColorWhite: gameBoard.isBottomWhite,
    difficulty: 2
};
var newGameBtn = document.querySelector(".new-game");
newGameBtn.addEventListener('click', function (e) {
    e.preventDefault();
    resetGame();
    switchColorBtn.classList.remove("disable-btn");
    resignBtn.classList.remove("disable-btn");
    gameView.checkmateDisable();
    gameView.removeGameLog();
    gameView.enableLevelButton("select-level");
});
/**
 * resignBtn - sets the isGamePlaying propery to false and stops the game
 */
var resignBtn = document.querySelector(".resign");
resignBtn.addEventListener("click", function (e) {
    e.preventDefault();
    state.isGamePlaying = false;
    switchColorBtn.classList.add("disable-btn");
    resignBtn.classList.add("disable-btn");
    gameView.checkmateStalemateEnable();
    gameView.disableLevelButton("select-level");
});
/**
 * switchColorBtn - switches the piece color for the user between white and black
 */
var switchColorBtn = document.querySelector(".switchColor");
switchColorBtn.addEventListener('click', function (e) {
    e.preventDefault();
    gameBoard.isBottomWhite = !gameBoard.isBottomWhite;
    state.isColorWhite = gameBoard.isBottomWhite;
    state.isPlayerTurn = gameBoard.isBottomWhite;
    removeAllPieces();
    intializeBoardData();
    setBoard();
    if (gameBoard.isBottomWhite) {
        gameView.disableLevelButton("select-level");
    }
    else {
        switchColorBtn.classList.add("disable-btn");
        gameView.disableLevelButton("select-level");
        state.isPlayerTurn = false;
        aiMakeMove();
    }
});
/**
 * selectLevelBtn - Selects the difficulty to play on
 */
var selectLevelValues = document.querySelector(".level-values");
var selectLevelDropdown = document.querySelector(".level-dropdown");
var easyBtn = selectLevelValues.children[0];
var mediumBtn = selectLevelValues.children[1];
var hardBtn = selectLevelValues.children[2];
easyBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.difficulty = 1;
    selectLevelDropdown.innerHTML = "Easy &darr;";
});
mediumBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.difficulty = 2;
    selectLevelDropdown.innerHTML = "Medium &darr;";
});
hardBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.difficulty = 3;
    selectLevelDropdown.innerHTML = "Hard &darr;";
});
/**
 * Resets the board's data and view.
 */
function resetGame() {
    removeAllPieces();
    gameBoard.isBottomWhite = true;
    intializeBoardData();
    setBoard();
    state.isColorWhite = true;
    state.isGamePlaying = true;
    state.firstMoveMade = false;
    state.isPlayerTurn = true;
}
/**
 * BOARD CONTROLLER
 */
intializeBoardData();
setBoard();
makeMove();
// game.getBoard().printPiecesTest();
// console.log(    `Printing board pieces`);
// game.getBoard().printPiecesTest();
/**
 * Adds all pieces to the data model
 */
function intializeBoardData() {
    gameBoard.initializeBoardTop();
    gameBoard.initializeBoardBottom();
}
/**
 * Removes all pieces from the data model and the view.
 */
function removeAllPieces() {
    ;
    for (var row = 0; row < MAX_LENGTH; row++) {
        for (var col = 0; col < MAX_LENGTH; col++) {
            gameBoard.boardCells[row][col].setPiece(null);
            gameView.removeAllPiecePlayerFast("" + row + col);
        }
    }
}
/**
 * Updates the view to match data model after initializing the board.
 */
function setBoard() {
    var piece;
    for (var row = 0; row < MAX_LENGTH; row++) {
        for (var col = 0; col < MAX_LENGTH; col++) {
            piece = gameBoard.boardCells[row][col].getPiece();
            var cell = document.querySelector(".cell-" + row + col);
            if (piece !== null) {
                gameView.removeAllPiecePlayerFast("" + row + col);
                gameView.insertPiecePlayerFast("" + row + col, piece.getType(), piece.getIsWhite());
                if (cell) {
                    cell.children[0].setAttribute("data-ispiecewhite", "" + piece.getIsWhite());
                }
            }
            if (cell !== null) {
                cell.setAttribute("data-cellid", "" + row + col);
            }
        }
    }
}
/**
 * Player Move Functionality
*/
function makeMove() {
    //PLAYERS TURN 
    var cells = document.querySelectorAll(".cell");
    var startCell = null;
    var endCell = null;
    cells.forEach(function (cell) {
        cell.addEventListener('click', function (e) {
            if (state.isPlayerTurn) {
                var isBottomWhite = state.isColorWhite ? 'true' : 'false';
                var currentTarget = e.target;
                if (startCell === null) {
                    if (currentTarget.classList.contains("chess-piece")) {
                        startCell = currentTarget.parentElement;
                    }
                    else {
                        startCell = currentTarget;
                    }
                    if (currentTarget.dataset.ispiecewhite !== isBottomWhite) {
                        startCell = null;
                    }
                    else if (startCell !== null && startCell.children.length > 0 && startCell.dataset.cellid !== undefined) {
                        var startChild = startCell.firstElementChild;
                        if (startChild.dataset.ispiecewhite === isBottomWhite) {
                            gameView.addPieceHighlight(startCell.dataset.cellid);
                        }
                    }
                    else {
                        startCell = null;
                    }
                }
                else {
                    if (currentTarget.classList.contains("chess-piece")) {
                        endCell = currentTarget.parentElement;
                    }
                    else {
                        endCell = currentTarget;
                    }
                }
                //use the model to determine if the selected position is valid
                if (startCell !== null && endCell !== null) {
                    if (startCell.dataset.cellid !== undefined && endCell.dataset.cellid !== undefined) {
                        var startRowIdx = parseInt(startCell.dataset.cellid[0]);
                        var startColIdx = parseInt(startCell.dataset.cellid[1]);
                        var endRowIdx = parseInt(endCell.dataset.cellid[0]);
                        var endColIdx = parseInt(endCell.dataset.cellid[1]);
                        var modelStartCell = gameBoard.boardCells[startRowIdx][startColIdx];
                        var modelEndCell = gameBoard.boardCells[endRowIdx][endColIdx];
                        var modelStartPiece = modelStartCell.getPiece();
                        if (modelStartCell !== null) {
                            if (modelStartPiece !== null) {
                                var isEndPositionValid = modelStartPiece.isValidMove(gameBoard, modelStartCell, modelEndCell);
                                var isRouteValid = game.isMovePossible(modelStartCell, modelEndCell, game.getBoard());
                                gameView.removePieceHighlight(startCell.dataset.cellid);
                                //TEST IF GAME IS IN CHECK
                                var isInCheck = game.isInCheck(modelStartCell, modelEndCell, game.getBoard());
                                //TEST IF EN PASSANT IS POSSIBLE
                                var canEnPassantBeMade = game.performEnPassant(modelStartCell, modelEndCell, game.getBoard());
                                if (canEnPassantBeMade !== null) {
                                    isEndPositionValid = true;
                                    isRouteValid = true;
                                }
                                //TEST IF CASTLING IS POSSIBLE
                                var canCastlingBeMade = game.makeCastlingMove(modelStartCell, modelEndCell, game.getBoard());
                                if (canCastlingBeMade !== null) {
                                    isEndPositionValid = true;
                                    isRouteValid = true;
                                }
                                //TEST IF THE POSITION IS IN INVALID POSITION.
                                if (!isEndPositionValid || !isRouteValid || (isInCheck.result === "currentPlayer-will-be-in-check")) {
                                    gameView.removeAllPiecePlayerFast(startCell.dataset.cellid);
                                    gameView.insertPiecePlayerFast(startCell.dataset.cellid, modelStartPiece.getType(), modelStartPiece.getIsWhite());
                                    gameView.removeWrongCellAnimation(startCell.dataset.cellid);
                                    gameView.addWrongCellAnimation(startCell.dataset.cellid);
                                    //TESTING IF THE PLAYER IS IN CHECK.
                                    if (isInCheck.result === "currentPlayer-will-be-in-check") {
                                        gameView.checkModal("player-check-modal");
                                    }
                                    /****************************************************************************************************************************************** */
                                    /** AT THIS POINT, THE POSITION THE PLAYER WANTS TO MOVE IS VALID **/
                                    /****************************************************************************************************************************************** */
                                }
                                else {
                                    if (canEnPassantBeMade === null) {
                                        gameView.insertGameLog(false, modelStartCell, modelEndCell, game);
                                    }
                                    if (modelEndCell.getPiece() !== null) {
                                        gameView.addMovingCellAnimationCapture(startCell.dataset.cellid);
                                        gameView.addMovingCellAnimationCapture(endCell.dataset.cellid);
                                    }
                                    else {
                                        gameView.addMovingCellAnimationNoCapture(startCell.dataset.cellid);
                                        gameView.addMovingCellAnimationNoCapture(endCell.dataset.cellid);
                                    }
                                    //TESTING FOR AND SETTING PAWN PROMOTION
                                    game.setPawnPromotion(modelStartCell, modelEndCell, game.getBoard());
                                    gameView.disableButtonView("switchColor");
                                    gameView.disableLevelButton("select-level");
                                    state.isPlayerTurn = !state.isPlayerTurn;
                                    //IF EN PASSANT IS POSSIBLE - UPDATE UI
                                    if (canEnPassantBeMade !== null) {
                                        var pawnCell = canEnPassantBeMade;
                                        gameView.removeAllPiecePlayerFast("" + pawnCell.getX() + pawnCell.getY());
                                        gameView.isEnPassantLog(false, modelStartCell, modelEndCell, game);
                                    }
                                    //IF CASTLING IS POSSIBLE - UPDATE UI
                                    if (canCastlingBeMade !== null) {
                                        game.makeCastlingMove(modelStartCell, modelEndCell, gameBoard);
                                        var oldKingCell = canCastlingBeMade.oldKingCell;
                                        var newKingCell = canCastlingBeMade.newKingCell;
                                        var oldRookCell = canCastlingBeMade.oldRookCell;
                                        var newRookCell = canCastlingBeMade.newRookCell;
                                        //UPDATE THE VIEW
                                        var newKingPiece = newKingCell.getPiece();
                                        var newRookPiece = newRookCell.getPiece();
                                        if (newKingPiece !== null && newRookPiece !== null) {
                                            gameView.removeAllPiecePlayerFast("" + oldKingCell.getX() + oldKingCell.getY());
                                            gameView.removeAllPiecePlayerFast("" + oldRookCell.getX() + oldRookCell.getY());
                                            gameView.insertPiecePlayerFast("" + newKingCell.getX() + newKingCell.getY(), newKingPiece.getType(), newKingPiece.getIsWhite());
                                            gameView.insertPiecePlayerFast("" + newRookCell.getX() + newRookCell.getY(), newRookPiece.getType(), newRookPiece.getIsWhite());
                                            gameView.insertCastlingLog(false, newKingCell.getY() < oldKingCell.getY() ? false : true);
                                        }
                                    }
                                    /** REMOVE THE CELL HOVER ANIMATION */
                                    var targetCell_1 = document.querySelector(".cell-" + modelEndCell.getX() + modelEndCell.getY());
                                    if (targetCell_1) {
                                        targetCell_1.classList.toggle('cell');
                                        setTimeout(function () {
                                            if (targetCell_1) {
                                                targetCell_1.classList.toggle('cell');
                                            }
                                        }, 500);
                                    }
                                    var modelStartPiece_1 = modelStartCell.getPiece();
                                    if (modelStartPiece_1) {
                                        modelStartCell.setPiece(null);
                                        gameView.removeAllPiecePlayerFast("" + modelStartCell.getX() + modelStartCell.getY());
                                    }
                                    if (modelStartPiece_1 !== null) {
                                        /*
                                            CASTLING ASSURANCE
                                        If modelStartPiece IS KING / ROOK - set isFirstMove to false.
                                        */
                                        if (modelStartPiece_1.getType() === "King") {
                                            var king = modelStartPiece_1;
                                            king.isFirstMove = false;
                                        }
                                        else if (modelStartPiece_1.getType() === "Rook") {
                                            var rook = modelStartPiece_1;
                                            rook.isFirstMove = false;
                                        }
                                        //REMOVE OPPONENT'S PIECE FROM THE MODEL AND THE VIEW IF IT EXISTS
                                        if (modelEndCell.getPiece() !== null) {
                                            var endPiece = modelEndCell.getPiece();
                                            if (endPiece !== null) {
                                                gameView.removeAllPiecePlayerFast(startCell.dataset.cellid);
                                            }
                                            modelEndCell.setPiece(null);
                                        }
                                        modelEndCell.setPiece(modelStartPiece_1);
                                        gameView.insertPiecePlayerFast(endCell.dataset.cellid, modelStartPiece_1.getType().toLowerCase(), modelStartPiece_1.getIsWhite());
                                        if (modelStartPiece_1.getType() === 'Pawn') {
                                            var pawn = modelStartPiece_1;
                                            pawn.isFirstMove = false;
                                        }
                                        if (isInCheck.result === "opponent-in-check") {
                                            var isCheckmate = game.isCheckmate(isInCheck.checkingPieceCell, game.getBoard());
                                            if (isCheckmate) {
                                                gameView.checkModal("player-checkmate-modal");
                                                gameView.checkmateStalemateEnable();
                                                gameView.insertSpecialLog(false, true, true, false);
                                                return;
                                            }
                                            else {
                                                gameView.checkModal("opponent-check-modal");
                                                gameView.insertSpecialLog(false, true, false, false);
                                            }
                                        }
                                        //TEST IF GAME IS IN STALEMATE
                                        var isGameStalemate = game.stalemateCheck(!modelStartPiece_1.getIsWhite(), game.getBoard());
                                        if (isGameStalemate) {
                                            gameView.stalemateModal();
                                            gameView.checkmateStalemateEnable();
                                            gameView.insertSpecialLog(false, false, false, true);
                                            return;
                                        }
                                    }
                                    setBoard();
                                    state.isPlayerTurn = !state.isPlayerTurn;
                                    setTimeout(function () {
                                        aiMakeMove();
                                    }, 800);
                                }
                            }
                        }
                        startCell = null;
                        endCell = null;
                    }
                }
            } //isPlayerTurn check.
        });
    });
}
/**
 * AI Move Functionality
*/
function aiMakeMove() {
    setTimeout(function () {
        /** BUILD BOARD TREE */
        var root = game.buildBoardTree(state.difficulty, state.isColorWhite);
        /** PERFORM MINIMAX */
        if (root !== undefined) {
            var staticEvaluation = game.performMinimax(root, state.difficulty, -1000000, 1000000, state.isColorWhite === true ? false : true);
            // console.log(`aiMakeMove - lowest static evaluation : ${staticEvaluation}`);
            var bestMove = game.performBFS(root, staticEvaluation);
            if (bestMove !== undefined) {
                var currentBoard = bestMove.getCurrentBoard();
                if (currentBoard !== null) {
                    removeAllPieces();
                    gameBoard = currentBoard;
                    setBoard();
                    /*
                        TESTING FOR CHECK / CHECKMATE
                    */
                    var prevBoard = bestMove.getPrevBoard();
                    var startCell = bestMove.getStartCell();
                    var endCell = bestMove.getEndCell();
                    var startPiece = bestMove.getStartPiece();
                    var endPiece = bestMove.getEndPiece();
                    /**
                        TESTING FOR EN PASSANT
                    */
                    if (startCell !== null && endCell !== null && prevBoard !== null) {
                        /**
                            TESTING FOR CASTLING
                            //If the prev start cell is 2 places to the left or right (col)
                        */
                        //IF CASTLING IS POSSIBLE - UPDATE UI
                        var canCastlingBeMade = game.isCastlingPossible(startCell, endCell, prevBoard);
                        if (canCastlingBeMade !== null) {
                            //NB: castling is made in the game model. The curr board already has the cells updated.
                            var currStartCell = currentBoard.boardCells[startCell.getX()][startCell.getY()];
                            var currEndCell = currentBoard.boardCells[endCell.getX()][endCell.getY()];
                            gameView.insertCastlingLog(true, currStartCell.getY() < currEndCell.getY() ? false : true);
                        }
                        else {
                            gameView.insertGameLog(true, startCell, endCell, game);
                        }
                    }
                    if (startCell !== null && endCell !== null && prevBoard !== null && startPiece !== null) {
                        // console.error(`${startPiece.getType()} Moved Is: StartCell: (${startCell.getX()},${startCell.getY()}) to EndCell: (${endCell.getX()},${endCell.getY()})`);
                        // gameView.removePiece(`${pawnCell.getX()}${pawnCell.getY()}`);
                        //CHECK AND UPDATE FOR PAWN PROMOTION
                        var promotedPiece = game.setPawnPromotion(startCell, endCell, prevBoard);
                        if (promotedPiece !== null) {
                            //update the current board 
                            gameBoard.boardCells[endCell.getX()][endCell.getY()].setPiece(promotedPiece);
                            setBoard();
                        }
                        if (endPiece === null) {
                            gameView.addMovingCellAnimationNoCapture("" + startCell.getX() + startCell.getY());
                            gameView.addMovingCellAnimationNoCapture("" + endCell.getX() + endCell.getY());
                        }
                        else {
                            gameView.addMovingCellAnimationCapture("" + startCell.getX() + startCell.getY());
                            gameView.addMovingCellAnimationCapture("" + endCell.getX() + endCell.getY());
                        }
                        // currentBoard.printPiecesTest();
                        //TEST IF GAME IS IN CHECK
                        var isInCheck = game.isInCheck(startCell, endCell, prevBoard);
                        var checkingCell = isInCheck.checkingPieceCell;
                        //TEST IF GAME IS IN STALEMATE
                        var isGameStalemate = game.stalemateCheck(true, currentBoard);
                        //TEST IF THE START PIECE IS A PAWN - set the first move to false
                        if (startPiece !== null && startPiece.getType() === 'Pawn') {
                            var pawn = startPiece;
                            pawn.isFirstMove = false;
                        }
                        // TEST FOR CHECK AND CHECKMATE.
                        if (isInCheck.result === "opponent-in-check" && checkingCell !== null) {
                            //NB: The checking cell is an object belonging to the prev board, not the current board, therefore need to be set to the current board.
                            var newCheckingCellX = checkingCell.getX();
                            var newCheckingCellY = checkingCell.getY();
                            var newCheckingCell = currentBoard.boardCells[newCheckingCellX][newCheckingCellY];
                            var isCheckmate = game.isCheckmate(newCheckingCell, currentBoard);
                            if (isCheckmate) {
                                // prevBoard.printPiecesTest();
                                // currentBoard.printPiecesTest();
                                // if(isInCheck.checkingPieceCell !== null){
                                //     console.log(`Checking Piece Cell is : (${checkingCell.getX()},${checkingCell.getY()})`)
                                // }
                                // console.log('Player is in Checkmate!');
                                gameView.checkModal("AI-checkmate-modal");
                                gameView.checkmateStalemateEnable();
                                gameView.insertSpecialLog(true, true, true, false);
                                return;
                            }
                            else {
                                // console.log('Player is in Check!');
                                gameView.checkModal("player-check-modal");
                                gameView.insertSpecialLog(true, true, false, false);
                            }
                        }
                        // TEST FOR STALEMATE
                        else if (isGameStalemate) {
                            gameView.stalemateModal();
                            gameView.checkmateStalemateEnable();
                            gameView.insertSpecialLog(true, false, false, true);
                        }
                    }
                }
                else {
                    // console.error(`board is null in aiMakeMove`);
                    return;
                }
            }
            else {
                // console.error(`bestMove is undefined in aiMakeMove`);
                return;
            }
        }
        else {
            // console.error(`root is undefined in aiMakeMove`);
            return;
        }
        state.isPlayerTurn = true;
    }, 0);
}

},{"../models/Board":3,"../models/Game":6,"../models/Quote":12,"../view/gameView":15}],2:[function(require,module,exports){
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
 * Bishop Class
 */
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function Bishop(isWhite, isPresent) {
        return _super.call(this, isWhite, isPresent, 'Bishop') || this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    Bishop.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
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
        }
        return false;
    };
    /**
     * Determines if the endCell matches a valid position for a Bishop on the board.
     * @param {number} x a valid row position for a Bishop.
     * @param {number} y a valid column position for a Bishop.
     * @param {Cell} endCell Destination position of the Cell.
     * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
     */
    Bishop.prototype.endCellMatch = function (x, y, endCell) {
        if (x === endCell.getX() && y === endCell.getY()) {
            return true;
        }
        return false;
    };
    return Bishop;
}(Piece_1.Piece));
exports.Bishop = Bishop;

},{"./Piece":10}],3:[function(require,module,exports){
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

},{"./Bishop":2,"./Cell":5,"./King":7,"./Knight":8,"./Pawn":9,"./Queen":11,"./Rook":13}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var board_1 = require("./board");
var Queen_1 = require("./Queen");
var Rook_1 = require("./Rook");
var BoardTree_1 = require("./BoardTree");
var Game = /** @class */ (function () {
    /**
     *
     * @param {Board} board Board used for the Chess Game.
     */
    function Game(board) {
        this.board = board;
    }
    /**
     *
     * @return {Board}  Returns the board associated with this Chess Game.
     */
    Game.prototype.getBoard = function () {
        return this.board;
    };
    Game.prototype.setBoard = function (board) {
        this.board = board;
    };
    /**
     * Checks if any pieces of either color are between the start cell's position and the end cell's position exclusive. (Excluding the Knight)
     * @param {Cell} startCell current position of the piece
     * @param {Cell} endCell final position of the piece
     * @return {Board}  Returns the board associated with this Chess Game.
     */
    Game.prototype.isMovePossible = function (startCell, endCell, board) {
        //8 different possibilites
        var startX = startCell.getX();
        var startY = startCell.getY();
        var endX = endCell.getX();
        var endY = endCell.getY();
        var startPiece = startCell.getPiece();
        if (startPiece !== null) {
            if (startPiece.getType() === 'Knight') {
                return true;
            }
        }
        while (startX !== endX || startY !== endY) {
            //if a piece is in between to end position.
            if (endX < startX && endY < startY) {
                startX -= 1;
                startY -= 1;
            }
            else if (endX === startX && endY < startY) {
                startY -= 1;
            }
            else if (endX > startX && endY < startY) {
                startX += 1;
                startY -= 1;
            }
            else if (endX > startX && endY === startY) {
                startX += 1;
            }
            else if (endX > startX && endY > startY) {
                startX += 1;
                startY += 1;
            }
            else if (endX === startX && endY > startY) {
                startY += 1;
            }
            else if (endX < startX && endY > startY) {
                startX -= 1;
                startY += 1;
            }
            else if (endX < startX && endY === startY) {
                startX -= 1;
            }
            //if a piece between exists 
            if ((board.boardCells[startX][startY].getPiece() !== null) && (startX !== endX || startY !== endY)) {
                return false;
            }
        }
        var endPiece = endCell.getPiece();
        //check if start piece and end piece are different colors
        if (startPiece !== null && endPiece !== null) {
            if (startPiece.getIsWhite() === endPiece.getIsWhite()) {
                return false;
            }
            return true;
        }
        return true;
    };
    /**
    * Promotes the pawn to Queen.
    * @param {Board} board Board consisting of Cells
    * @param {Cell} startCell Current position(x, y) of the Cell.
    * @param {Cell} endCell Destination position(x, y) of the Cell.
    * @return {Piece} Returns the piece after promoting it to Queen.
    */
    Game.prototype.setPawnPromotion = function (startCell, endCell, board) {
        var piece = startCell.getPiece();
        if (piece !== null && piece.getType() === 'Pawn') {
            var pawn = piece;
            if (pawn.isMovingUp && endCell.getX() === 0 && pawn.isValidMove(board, startCell, endCell) && this.isMovePossible(startCell, endCell, board)) {
                startCell.setPiece(new Queen_1.Queen(pawn.getIsWhite(), true));
                return startCell.getPiece();
            }
            else if (!pawn.isMovingUp && endCell.getX() === 7 && pawn.isValidMove(board, startCell, endCell) && this.isMovePossible(startCell, endCell, board)) {
                startCell.setPiece(new Queen_1.Queen(pawn.getIsWhite(), true));
                return startCell.getPiece();
            }
        }
        return null;
    };
    /*
        Set the moving pawn cell to en passant
    */
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} movingCell Current position(x, y) of the Cell that is performing En passant.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} Opponent's pawn cell if en passant can be made. Null o/w.
     */
    Game.prototype.performEnPassant = function (movingCell, endCell, board) {
        var movingCellPiece = movingCell.getPiece();
        if (movingCellPiece === null) {
            return null;
        }
        var opponentColor = !movingCellPiece.getIsWhite();
        var cells = board.boardCells;
        var opponentPawn = null;
        var opponentPawnCell = null;
        //check all the opponent's pawns to see which one has "isEnPassant set to true" - save it and change it to false
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var piece = cells[row][col].getPiece();
                if (piece !== null && piece.getIsWhite() === opponentColor && piece.getType() === "Pawn") {
                    //OPPONENT'S PAWN
                    var pawnPiece = piece;
                    if (pawnPiece.isEnPassant === true) {
                        opponentPawn = pawnPiece;
                        opponentPawnCell = cells[row][col];
                        if (opponentPawnCell !== null) {
                            //CHECK IF MOVE IS VALID 
                            if (movingCellPiece.isValidMove(board, movingCell, endCell) && this.isMovePossible(movingCell, endCell, board)) {
                                opponentPawn.isEnPassant = false;
                                return null;
                            }
                            var movingPiece = movingCell.getPiece();
                            if (movingPiece !== null && movingPiece.getType() === "Pawn") {
                                var movingPawn = movingPiece;
                                if (movingPawn !== null && movingPawn.isMovingUp) {
                                    if ((endCell.getX() === movingCell.getX() - 1 && endCell.getY() === movingCell.getY() - 1) && (opponentPawnCell.getX() === movingCell.getX() && opponentPawnCell.getY() === movingCell.getY() - 1)) {
                                        opponentPawn.isEnPassant = false;
                                        return opponentPawnCell;
                                    }
                                    else if ((endCell.getX() === movingCell.getX() - 1 && endCell.getY() === movingCell.getY() + 1) && (opponentPawnCell.getX() === movingCell.getX() && opponentPawnCell.getY() === movingCell.getY() + 1)) {
                                        opponentPawn.isEnPassant = false;
                                        return opponentPawnCell;
                                    }
                                }
                                else if (movingPawn !== null && !movingPawn.isMovingUp) {
                                    if ((endCell.getX() === movingCell.getX() + 1 && endCell.getY() === movingCell.getY() + 1) && (opponentPawnCell.getX() === movingCell.getX() && opponentPawnCell.getY() === movingCell.getY() + 1)) {
                                        opponentPawn.isEnPassant = false;
                                        return opponentPawnCell;
                                    }
                                    else if ((endCell.getX() === movingCell.getX() + 1 && endCell.getY() === movingCell.getY() - 1) && (opponentPawnCell.getX() === movingCell.getX() && opponentPawnCell.getY() === movingCell.getY() - 1)) {
                                        opponentPawn.isEnPassant = false;
                                        return opponentPawnCell;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        return null;
    };
    /**
     * Determines if a castling move is possible
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {Object} An object containing all participating cells is returned is successfull, null o/w.
     */
    Game.prototype.isCastlingPossible = function (startCell, endCell, board) {
        //Validating the startCell has a King. 
        var startPiece = startCell !== null ? startCell.getPiece() : null;
        if (startPiece === null) {
            return null;
        }
        if (startPiece !== null && startPiece.getType() !== "King") {
            return null;
        }
        var kingCell = startCell;
        var kingPiece = startPiece;
        if (!kingPiece.isFirstMove) {
            return null;
        }
        /*
            GET ROOK
        */
        var cells = board.boardCells;
        // If rook is to the right.
        if (endCell !== null && endCell.getY() > startCell.getY()) {
            // If the end cell is at the bottom right
            if (startCell.getX() === 7 && startCell.getY() === 4 && endCell.getX() === 7 && endCell.getY() === 6) {
                var rookCell = cells[7][7];
                var rookPiece = this.castlingIsValidRook(rookCell) !== null ? rookCell.getPiece() : null;
                if (rookPiece !== null && rookPiece.isFirstMove) {
                    //Check if there are pieces in between the King and the Rook
                    if (this.castlingEmptyPathCheck(kingCell, rookCell, false, board)) {
                        //Check if the opponent can reach the cells where the King crosses and ends on.
                        if (this.castlingCannotReachCells([kingCell, cells[kingCell.getX()][kingCell.getY() + 1], cells[kingCell.getX()][kingCell.getY() + 2]], board)) {
                            return {
                                oldKingCell: kingCell,
                                newKingCell: cells[kingCell.getX()][kingCell.getY() + 2],
                                oldRookCell: rookCell,
                                newRookCell: cells[rookCell.getX()][rookCell.getY() - 2]
                            };
                        }
                    }
                }
            }
            // If the end cell is at the top right
            else if (startCell.getX() === 0 && startCell.getY() === 4 && endCell.getX() === 0 && endCell.getY() === 6) {
                var rookCell = cells[0][7];
                var rookPiece = this.castlingIsValidRook(rookCell) !== null ? rookCell.getPiece() : null;
                if (rookPiece !== null && rookPiece.isFirstMove) {
                    //Check if there are pieces in between the King and the Rook
                    if (this.castlingEmptyPathCheck(kingCell, rookCell, false, board)) {
                        //Check if the opponent can reach the cells where the King crosses and ends on.
                        if (this.castlingCannotReachCells([kingCell, cells[kingCell.getX()][kingCell.getY() + 1], cells[kingCell.getX()][kingCell.getY() + 2]], board)) {
                            return {
                                oldKingCell: kingCell,
                                newKingCell: cells[kingCell.getX()][kingCell.getY() + 2],
                                oldRookCell: rookCell,
                                newRookCell: cells[rookCell.getX()][rookCell.getY() - 2]
                            };
                        }
                    }
                }
            }
        }
        // If rook is to the left.
        else if (endCell !== null && endCell.getY() < startCell.getY()) {
            // If the end cell is at the bottom left
            if (startCell.getX() === 7 && startCell.getY() === 4 && endCell.getX() === 7 && endCell.getY() === 2) {
                var rookCell = cells[7][0];
                var rookPiece = this.castlingIsValidRook(rookCell) !== null ? rookCell.getPiece() : null;
                if (rookPiece !== null && rookPiece.isFirstMove) {
                    //Check if there are pieces in between the King and the Rook
                    if (this.castlingEmptyPathCheck(kingCell, rookCell, true, board)) {
                        //Check if the opponent can reach the cells where the King crosses and ends on.
                        if (this.castlingCannotReachCells([kingCell, cells[kingCell.getX()][kingCell.getY() - 1], cells[kingCell.getX()][kingCell.getY() - 2]], board)) {
                            return {
                                oldKingCell: kingCell,
                                newKingCell: cells[kingCell.getX()][kingCell.getY() - 2],
                                oldRookCell: rookCell,
                                newRookCell: cells[rookCell.getX()][rookCell.getY() + 3]
                            };
                        }
                    }
                }
            }
            // If the end cell is at the top left
            else if (startCell.getX() === 0 && startCell.getY() === 4 && endCell.getX() === 0 && endCell.getY() === 2) {
                var rookCell = cells[0][0];
                var rookPiece = this.castlingIsValidRook(rookCell) !== null ? rookCell.getPiece() : null;
                if (rookPiece !== null && rookPiece.isFirstMove) {
                    //Check if there are pieces in between the King and the Rook
                    if (this.castlingEmptyPathCheck(kingCell, rookCell, true, board)) {
                        //Check if the opponent can reach the cells where the King crosses and ends on.
                        if (this.castlingCannotReachCells([kingCell, cells[kingCell.getX()][kingCell.getY() - 1], cells[kingCell.getX()][kingCell.getY() - 2]], board)) {
                            return {
                                oldKingCell: kingCell,
                                newKingCell: cells[kingCell.getX()][kingCell.getY() - 2],
                                oldRookCell: rookCell,
                                newRookCell: cells[rookCell.getX()][rookCell.getY() + 3]
                            };
                        }
                    }
                }
            }
        }
        return null;
    };
    /**
    * If possible, makes the castling move on the board.
    * @param {Board} board Board consisting of Cells
    * @param {Cell} startCell Current position(x, y) of the Cell.
    * @param {Cell} endCell Destination position(x, y) of the Cell.
    * @return {Object} An object containing all participating cells is returned is successfull, null o/w.
    */
    Game.prototype.makeCastlingMove = function (startCell, endCell, board) {
        var isCastlingPossibleResult = this.isCastlingPossible(startCell, endCell, board);
        if (isCastlingPossibleResult === null) {
            return null;
        }
        var startPiece = startCell !== null ? startCell.getPiece() : null;
        if (startPiece === null) {
            return null;
        }
        if (startPiece !== null && startPiece.getType() !== "King") {
            return null;
        }
        var kingCell = startCell;
        var kingPiece = startPiece;
        var isPieceColorWhite = kingPiece.getIsWhite();
        var rookPiece = new Rook_1.Rook(isPieceColorWhite, true);
        var cells = board.boardCells;
        isCastlingPossibleResult.oldKingCell.setPiece(null);
        isCastlingPossibleResult.newKingCell.setPiece(kingPiece);
        isCastlingPossibleResult.oldRookCell.setPiece(null);
        isCastlingPossibleResult.newRookCell.setPiece(rookPiece);
        return isCastlingPossibleResult;
    };
    /**
     * Helper method for Castling. (Determines if there is an empty path between the participating King and Rook)
     * @param {Board} board Board consisting of Cells
     * @param {Cell} kingCell The King Cell participating in the Castling move.
     * @param {Cell} rookCell The Rook Cell participating in the Castling move.
     * @return {boolean} True if the path between the King Cell and Rook Cell is empty, false o/w.
     */
    Game.prototype.castlingEmptyPathCheck = function (kingCell, rookCell, toLeft, board) {
        var cells = board.boardCells;
        // If the King is going left. -> Decrement Y values
        if (toLeft) {
            for (var col = kingCell.getY() - 1; col > rookCell.getY(); col--) {
                if (cells[kingCell.getX()][col].getPiece() !== null) {
                    return false;
                }
            }
        }
        // If the King is going right. -> Increment Y vlaues
        else {
            for (var col = kingCell.getY() + 1; col < rookCell.getY(); col++) {
                if (cells[kingCell.getX()][col].getPiece() !== null) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Helper method for Castling. (Determines if the argument Cell contains a Rook Piece)
     * @param {Cell} kingCell The King Cell participating in the Castling move.
     * @return {boolean} True if the Cell, cell, contains a Rook Piece.
     */
    Game.prototype.castlingIsValidRook = function (cell) {
        if (cell !== null) {
            var piece = cell.getPiece();
            if (piece !== null) {
                if (piece.getType() === "Rook") {
                    return true;
                }
            }
        }
        return false;
    };
    /*
        Checks if the cells the King crosses and ends on can be reached.
     */
    /**
     * Helper method for Castling. (Determines if the cells between the King Piece and the Rook Piece can be reached by other Pieces)
     * @param {Board} board Board consisting of Cells
     * @param {Cell[]} kingCell An array of cells between the King Piece and the Rook Piece.
     * @return {boolean} True if no other pieces can reach the participating Cells, False o/w.
     */
    Game.prototype.castlingCannotReachCells = function (cellsToRook, board) {
        var king = cellsToRook[0].getPiece();
        var opponentColor = king !== null ? !king.getIsWhite() : null;
        var cells = board.boardCells;
        for (var cellNum = 0; cellNum < cellsToRook.length; cellNum++) {
            for (var row = 0; row < cells.length; row++) {
                for (var col = 0; col < cells[row].length; col++) {
                    var cell = cells[row][col];
                    var piece = cell.getPiece();
                    //opponent's piece  
                    if (opponentColor !== null && piece !== null && piece.getIsWhite() === opponentColor) {
                        var opponentPiece = piece;
                        var oppoenentCell = cell;
                        // If the opponent can reach the cells from King to Rook.
                        if (opponentPiece.isValidMove(board, oppoenentCell, cellsToRook[cellNum]) && this.isMovePossible(oppoenentCell, cellsToRook[cellNum], board)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };
    /**
     * Stalemate check. Determines if the opposite player will be in stalemate once the current player makes a move.
     * @param {Board} board Board consisting of Cells
     * @param {boolean} isOppositePieceWhite True, if the opposite Piece is white, False o/w,
     * @return {boolean} True if Stalemate, False o/w.
     */
    Game.prototype.stalemateCheck = function (isOppositePieceWhite, board) {
        //getting the opposing piece's color.
        var kingObj = this.getKing(isOppositePieceWhite, board);
        var king = null;
        var kingCell = null;
        //Checking if the opposing player's king is in check.
        if (kingObj !== null) {
            king = kingObj.king;
            kingCell = kingObj.kingCell;
        }
        if (king !== null && king.isInCheck) {
            return false;
        }
        //At this point, the opposing player's king is not in check.
        var cells = board.boardCells;
        // 1) Loop over all the cells on the board and look for pieces belonging to the opposing player.
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var currCell = cells[row][col];
                var currPiece = currCell.getPiece();
                // Opposite player's piece.  
                if (currPiece !== null && currPiece.getIsWhite() === isOppositePieceWhite) {
                    // Check if a movement from that piece's cell to the remaining 63 cells in the game is possible.
                    //Make sure that the move will not lead to check
                    for (var innerRow = 0; innerRow < cells.length; innerRow++) {
                        for (var innerCol = 0; innerCol < cells[innerRow].length; innerCol++) {
                            if (currPiece.isValidMove(board, currCell, cells[innerRow][innerCol]) && this.isMovePossible(currCell, cells[innerRow][innerCol], board) && this.isInCheck(currCell, cells[innerRow][innerCol], board).result === "no-check") {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    };
    /**
     * Gets the King of the specified color.
     * @param isPieceColorWhite color of the King to retrieve
     * @return Object containing the King piece and it's cell.
     */
    Game.prototype.getKing = function (isPieceColorWhite, board) {
        var cells = board.boardCells;
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var currPiece = cells[row][col].getPiece();
                if (currPiece !== null && currPiece.getIsWhite() === isPieceColorWhite) {
                    //looking at all pieces matching the moving color
                    if (currPiece.getType() === 'King') {
                        var king = currPiece;
                        var kingCell = cells[row][col];
                        return {
                            king: king,
                            kingCell: kingCell
                        };
                    }
                }
            }
        }
        return null;
    };
    /**
     * Determines if the current player will be in check when the Piece is removed from the Start Cell and added to the End Cell.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {Object} An object containing the cell that will put the current player in check if Applicable, otherwise an object containing null will be returned.
     */
    Game.prototype.isInCheck = function (startCell, endCell, board) {
        /*****
        * Get piece(s) associate with the start cell and end cell.
        * ****/
        var startCellPiece = startCell.getPiece();
        var endCellPiece = endCell.getPiece();
        /*****
        * Before Check - Move piece from start cell to end cell if movement is valid.
        * ****/
        var moveWasPossible = startCellPiece !== null && startCellPiece.isValidMove(board, startCell, endCell) && this.isMovePossible(startCell, endCell, board);
        if (moveWasPossible) {
            startCell.setPiece(null);
            endCell.setPiece(startCellPiece);
        }
        else {
            return {
                result: "no-check",
                checkingPieceCell: null
            };
        }
        /*****
        * Get the piece and color of the current player's piece after moving it to the end cell.
        * ****/
        var currPlayerPiece = endCell.getPiece();
        var isPieceColorWhite = currPlayerPiece !== null ? currPlayerPiece.getIsWhite() : null;
        var cells = board.boardCells;
        /*
         ************************************************** Checking If The Current Player Is In Check *****************************************************
        *

        /*****
        * Get the king of the current Player.
        * ****/
        var currPlayerKingObj = isPieceColorWhite !== null ? this.getKing(isPieceColorWhite, board) : null;
        var currPlayerKingPiece = currPlayerKingObj !== null ? currPlayerKingObj.king : null;
        var currPlayerKingCell = currPlayerKingObj !== null ? currPlayerKingObj.kingCell : null;
        /*****
        * Get the king of the opponent.
        * ****/
        var opponentKingObj = this.getKing(!isPieceColorWhite, board);
        var opponentKingPiece = opponentKingObj !== null ? opponentKingObj.king : null;
        var opponentKingCell = opponentKingObj !== null ? opponentKingObj.kingCell : null;
        /*****
        *  1) CURRENT PLAYER IS MOVING - Check if the opponent's pieces can reach the current player's king.
        * ****/
        if (currPlayerPiece !== null) {
            if (moveWasPossible) {
                for (var row = 0; row < cells.length; row++) {
                    for (var col = 0; col < cells[row].length; col++) {
                        var currPiece = cells[row][col].getPiece();
                        if (currPiece !== null && currPiece.getIsWhite() !== isPieceColorWhite) {
                            // currPiece - A piece opposite to the current Player's color.
                            // get the cell of currPiece
                            // compare the opponent's cell to the end cell of the currentPlayer's king.
                            var opponentPiece = currPiece;
                            var opponentPieceCell = board.boardCells[row][col];
                            if (currPlayerKingCell !== null) {
                                if (opponentPiece.isValidMove(board, opponentPieceCell, currPlayerKingCell) && this.isMovePossible(opponentPieceCell, currPlayerKingCell, board)) {
                                    this.swapBackPieces(startCell, endCell, startCellPiece, endCellPiece);
                                    return {
                                        result: "currentPlayer-will-be-in-check",
                                        checkingPieceCell: opponentPieceCell
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
        /*
         ************************************************** Checking If Opponent Is In Check *****************************************************
        */
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var currPiece = cells[row][col].getPiece();
                if (currPiece !== null && currPiece.getIsWhite() === isPieceColorWhite) {
                    // currPlayerPieceCell - A cell of the current player
                    // currentPlayerPiece - A piece of the current player
                    var currentPlayerPieceCell = board.boardCells[row][col];
                    var currentPlayerPiece = currPiece;
                    if (opponentKingCell !== null) {
                        if (currentPlayerPiece.isValidMove(board, currentPlayerPieceCell, opponentKingCell) && this.isMovePossible(currentPlayerPieceCell, opponentKingCell, board)) {
                            this.swapBackPieces(startCell, endCell, startCellPiece, endCellPiece);
                            opponentKingPiece !== null ? opponentKingPiece.isInCheck = true : null;
                            return {
                                result: "opponent-in-check",
                                checkingPieceCell: currentPlayerPieceCell
                            };
                        }
                    }
                }
            }
        }
        opponentKingPiece !== null ? opponentKingPiece.isInCheck = false : null;
        this.swapBackPieces(startCell, endCell, startCellPiece, endCellPiece);
        return {
            result: "no-check",
            checkingPieceCell: null
        };
    };
    /**
     * During isInCheck method, the pieces are moved as a test for check. This method return the pieces back to their original cells.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @param {Piece | null} startCellPiece The Piece object associated with the startCell.
     * @param {Cell | null} endCellPiece The Piece object associated with the endCell.
     */
    Game.prototype.swapBackPieces = function (startCell, endCell, startCellPiece, endCellPiece) {
        startCell.setPiece(startCellPiece);
        endCell.setPiece(endCellPiece);
    };
    /**
     * Determines if the opponent will be in Checkmate once the current player has made its move.
     * @param {Board} board Board consisting of Cells
     * @param {Cell | null} checkingPieceCell Cell containing the piece that has the opponent in Check.
     * @param {Board} board Board consisting of Cells
     */
    Game.prototype.isCheckmate = function (checkingPieceCell, board) {
        if (checkingPieceCell === null) {
            return false;
        }
        if (checkingPieceCell.getPiece() === null) {
            return false;
        }
        /**
         *  Test If The Opponent Is In Checkmate
         */
        var checkingPiece = checkingPieceCell.getPiece();
        var isOpponentPieceWhite = null;
        /* get the color opposite to the current player's piece */
        if (checkingPiece) {
            isOpponentPieceWhite = !checkingPiece.getIsWhite();
        }
        /*****
        * (1) Get the king of the Opponent.
        * ****/
        var opponentKingObj = isOpponentPieceWhite !== null ? this.getKing(isOpponentPieceWhite, board) : null;
        var opponentKingPiece = opponentKingObj !== null ? opponentKingObj.king : null;
        var opponentKingCell = opponentKingObj !== null ? opponentKingObj.kingCell : null;
        /*****
        * (2) Can the opponent's King move to a spot that is not under check?
        * ****/
        // get all 8 possible end cells for the opponent's king.
        // check to see if the opponent's king can move to each end cell.
        // if at least one of the end cells is a valid move and not under check.
        // -> opponent is not under checkmate.
        var cells = board.boardCells;
        var kingRow = opponentKingCell !== null ? opponentKingCell.getX() : null;
        var kingCol = opponentKingCell !== null ? opponentKingCell.getY() : null;
        if (opponentKingCell !== null && opponentKingPiece !== null && kingRow !== null && kingCol !== null) {
            if (cells[kingRow - 1] !== undefined && cells[kingRow - 1][kingCol] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow - 1][kingCol], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow - 1][kingCol])) {
                    return false;
                }
            }
            if (cells[kingRow + 1] !== undefined && cells[kingRow + 1][kingCol] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow + 1][kingCol], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow + 1][kingCol])) {
                    return false;
                }
            }
            if (cells[kingRow] !== undefined && cells[kingRow][kingCol - 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow][kingCol - 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow][kingCol - 1])) {
                    return false;
                }
            }
            if (cells[kingRow] !== undefined && cells[kingRow][kingCol + 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow][kingCol + 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow][kingCol + 1])) {
                    return false;
                }
            }
            if (cells[kingRow - 1] !== undefined && cells[kingRow - 1][kingCol + 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow - 1][kingCol + 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow - 1][kingCol + 1])) {
                    return false;
                }
            }
            if (cells[kingRow - 1] !== undefined && cells[kingRow - 1][kingCol - 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow - 1][kingCol - 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow - 1][kingCol - 1])) {
                    return false;
                }
            }
            if (cells[kingRow + 1] !== undefined && cells[kingRow + 1][kingCol + 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow + 1][kingCol + 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow + 1][kingCol + 1])) {
                    return false;
                }
            }
            if (cells[kingRow + 1] !== undefined && cells[kingRow + 1][kingCol - 1] !== undefined) {
                if (this.isInCheck(opponentKingCell, cells[kingRow + 1][kingCol - 1], board).checkingPieceCell === null && opponentKingPiece.isValidMove(board, opponentKingCell, cells[kingRow + 1][kingCol - 1])) {
                    return false;
                }
            }
        }
        /** At this point the opponent cannot move its king to another cell **/
        // The cell that has the opponent in check is 'checkingPieceCell'
        // check if the opponent can block / eat the checkingPieceCell with one of their pieces and remain out of check. NB(Only one piece can have the opponent in check)
        // -> opponent is not under checkmate.
        // opponent in under checkmate.
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var currentCell = cells[row][col];
                if (currentCell !== null) {
                    var currPiece = currentCell.getPiece();
                    if (currPiece !== null && currPiece.getIsWhite() === isOpponentPieceWhite && currPiece.getType() !== 'King') {
                        var opponentCell = currentCell;
                        var opponentPiece = currPiece;
                        //if the opponent can eat the piece or block the piece that has it in check.
                        if (opponentKingCell !== null && !this.ceckmateVerificationHelper(checkingPieceCell, opponentKingCell, opponentPiece, opponentCell, board)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };
    /**
     * Checkmate Helper. Determines if the move being made is a valid move.
     * @param startCell Cell that has the Opponent's King in Check.
     * @param endCell Cell where the opponent's King is located.
     *
     * @returns false if no checkmate, true if checkmate
     */
    Game.prototype.ceckmateVerificationHelper = function (checkingCell, checkedCell, opponentPiece, opponentCell, board) {
        var checkingCellX = checkingCell.getX();
        var checkingCellY = checkingCell.getY();
        var checkedCellX = checkedCell.getX();
        var checkedCellY = checkedCell.getY();
        //if a piece is in between the start and end position.
        while (checkingCellX !== checkedCellX || checkingCellY !== checkedCellY) {
            var currentCell = board.boardCells[checkingCellX][checkingCellY];
            //If the opponent's piece can protect the King, checkmate verification returns false
            if (opponentPiece.isValidMove(board, opponentCell, currentCell) && this.isMovePossible(opponentCell, currentCell, board) && this.isInCheck(opponentCell, currentCell, board).checkingPieceCell === null) {
                return false;
            }
            if (checkedCellX < checkingCellX && checkedCellY < checkingCellY) {
                checkingCellX -= 1;
                checkingCellY -= 1;
            }
            else if (checkedCellX === checkingCellX && checkedCellY < checkingCellY) {
                checkingCellY -= 1;
            }
            else if (checkedCellX > checkingCellX && checkedCellY < checkingCellY) {
                checkingCellX += 1;
                checkingCellY -= 1;
            }
            else if (checkedCellX > checkingCellX && checkedCellY === checkingCellY) {
                checkingCellX += 1;
            }
            else if (checkedCellX > checkingCellX && checkedCellY > checkingCellY) {
                checkingCellX += 1;
                checkingCellY += 1;
            }
            else if (checkedCellX === checkingCellX && checkedCellY > checkingCellY) {
                checkingCellY += 1;
            }
            else if (checkedCellX < checkingCellX && checkedCellY > checkingCellY) {
                checkingCellX -= 1;
                checkingCellY += 1;
            }
            else if (checkedCellX < checkingCellX && checkedCellY === checkingCellY) {
                checkingCellX -= 1;
            }
        }
        return true;
    };
    //* **************************************************************  ARTIFICIAL INTELLIGENCE   ********************************************************* */
    // VALUES FOR BOARD POSITIONS AND PIECE VALUES INSPIRED BY THOMASZ MICHNIEWSKI 
    /**
     * Piece Values for the Player and the AI, if the AI is Black.
     */
    // Player Piece Values 
    Game.prototype.getPawnValue = function () {
        return 10;
    };
    Game.prototype.getKnightValue = function () {
        return 30;
    };
    Game.prototype.getBishopValue = function () {
        return 40;
    };
    Game.prototype.getRookValue = function () {
        return 60;
    };
    Game.prototype.getQueenValue = function () {
        return 120;
    };
    Game.prototype.getKingValue = function () {
        return 10000;
    };
    // AI Piece Values
    Game.prototype.getComputerPawnValue = function () {
        return -30;
    };
    Game.prototype.getComputerKnightValue = function () {
        return -70;
    };
    Game.prototype.getComputerBishopValue = function () {
        return -90;
    };
    Game.prototype.getComputerRookValue = function () {
        return -130;
    };
    Game.prototype.getComputerQueenValue = function () {
        return -300;
    };
    Game.prototype.getComputerKingValue = function () {
        return -20000;
    };
    /**
     * Piece Values for the Player and the AI, if the AI is White.
     */
    // Player Piece Values 
    Game.prototype.getPawnValueSwitch = function () {
        return 30;
    };
    Game.prototype.getKnightValueSwitch = function () {
        return 70;
    };
    Game.prototype.getBishopValueSwitch = function () {
        return 90;
    };
    Game.prototype.getRookValueSwitch = function () {
        return 130;
    };
    Game.prototype.getQueenValueSwitch = function () {
        return 300;
    };
    Game.prototype.getKingValueSwitch = function () {
        return 20000;
    };
    // AI Piece Values.
    Game.prototype.getComputerPawnValueSwitch = function () {
        return -10;
    };
    Game.prototype.getComputerKnightValueSwitch = function () {
        return -30;
    };
    Game.prototype.getComputerBishopValueSwitch = function () {
        return -40;
    };
    Game.prototype.getComputerRookValueSwitch = function () {
        return -60;
    };
    Game.prototype.getComputerQueenValueSwitch = function () {
        return -120;
    };
    Game.prototype.getComputerKingValueSwitch = function () {
        return -10000;
    };
    //Pawn Table used if the AI is Black.
    Game.prototype.getPawnTableAIBlack = function () {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [70, 70, 70, 80, 80, 70, 70, 70],
            [20, 20, 25, 45, 45, 25, 20, 20],
            [5, 5, 10, 25, 25, 10, 5, 5],
            [0, 0, 0, 20, 20, 0, 0, 0, 0],
            [8, 5, 5, -5, -5, 3, 3, 8],
            [8, 15, 15, -15, -15, 15, 15, 8],
            [90, 90, 90, 90, 90, 90, 90, 90]
        ];
    };
    //Pawn Table used if the AI is White.
    Game.prototype.getPawnTableAIWhite = function () {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [8, 15, 15, -15, -15, 15, 15, 8],
            [8, 5, 5, -5, -5, 3, 3, 8],
            [0, 0, 0, 20, 20, 0, 0, 0, 0],
            [5, 5, 10, 25, 25, 10, 5, 5],
            [10, 10, 25, 45, 45, 25, 10, 10],
            [70, 70, 70, 80, 80, 70, 70, 70],
            [80, 80, 80, 80, 80, 80, 80, 80]
        ];
    };
    /**
     * Bishop Table For The Player
     */
    Game.prototype.getBishopTable = function () {
        return [
            [-30, -25, -10, -8, -8, -10, -25, -30],
            [-25, -20, -10, -5, -5, -10, -20, -25],
            [-20, -5, 10, 20, 20, 10, -5, -20],
            [-15, -5, 20, 20, 20, 20, -5, -15],
            [-15, -5, 20, 20, 20, 20, -5, -15],
            [-20, -5, 10, 20, 20, 10, -5, -20],
            [-25, -20, -10, -5, -5, -10, -20, -25],
            [-30, -25, -10, -5, -5, -10, -25, -30]
        ];
    };
    /**
     * Knight Table For The Player
     */
    Game.prototype.getKnightTable = function () {
        return [
            [-35, -20, -10, -10, -10, -10, -20, -35],
            [-20, 5, 15, 15, 15, 15, 5, -20],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-20, 5, 15, 15, 15, 15, 5, -20],
            [-35, -20, -10, -10, -10, -10, -20, -35]
        ];
    };
    /**
     * Rook Table For The Player
     */
    Game.prototype.getRookTable = function () {
        return [
            [5, 5, 5, 5, 5, 5, 5, 5],
            [10, 10, 10, 10, 10, 10, 10, 10],
            [5, 5, 5, 5, 5, 5, 5, 5],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-5, -5, 5, 5, 5, 5, -5, -5],
            [-5, -5, 5, 5, 5, 5, -5, -5],
            [5, 5, 5, 5, 5, 5, 5, 5]
        ];
    };
    /**
     * Queen Table For The Player
     */
    Game.prototype.getQueenTable = function () {
        return [
            [-35, -30, -20, -10, -10 - 20, -30, -35],
            [-30, -25, -15, -5, -5, -15, -25, -30],
            [-25, -5, 10, 10, 10, 10, -5, -25],
            [-15, 10, 20, 20, 20, 20, 10, -15],
            [-15, 10, 20, 20, 20, 20, 10, -15],
            [-25, -5, 10, 10, 10, 10, -5, -25],
            [-30, -25, -15, -5, -5, -15, -25, -30],
            [-35, -30, -20, -10, -10 - 20, -30, -35]
        ];
    };
    /**
     * King Table For The Player
     */
    Game.prototype.getKingTable = function () {
        return [
            [-50, -50, -50, -50, -50, -50, -50, -50],
            [-40, -40, -40, -40, -40, -40, -40, -40],
            [-40, -40, -40, -40, -40, -40, -40, -40],
            [-40, -40, -40, -40, -40, -40, -40, -40],
            [-30, -30, -30, -30, -30, -30, -30, -30],
            [-30, -30, -30, -30, -30, -30, -30, -30],
            [-20, -20, -20, -20, -20, -20, -20, -20],
            [30, 30, 50, 50, 50, 50, 30, 30]
        ];
    };
    /**
     * King Table (End Game) For The Player
     */
    Game.prototype.getKingTable2 = function () {
        return [
            [-30, -30, -30, -30, -30, -30, -30, -30],
            [10, 10, 10, 10, 10, 10, 10, 10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-10, 15, 35, 35, 35, 35, 15, -10],
            [-20, -20, -20, -20, -20, -20, -20, -20],
            [-30, -30, -30, -30, -30, -30, -30, -30]
        ];
    };
    /***************************************  VALUES FOR THE AI **************************************************/
    /**
     * Pawn Table For The AI
     */
    Game.prototype.getAIPawnTable = function () {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-8, -15, -15, 15, 15, -15, -15, -8],
            [-8, -5, -5, 5, 5, -3, -3, -8],
            [0, 0, 0, -20, -20, 0, 0, 0, 0],
            [-5, -5, -10, -25, -25, -10, -5, -5],
            [-10, -10, -25, -45, -45, -25, -10, -10],
            [-70, -70, -70, -80, -80, -70, -70, -70],
            [-80, -80, -80, -80, -80, -80, -80, -80]
        ];
    };
    /**
     * Bishop Table For The AI
     */
    Game.prototype.getAIBishopTable = function () {
        return [
            [30, 25, 10, 8, 8, 10, 25, 30],
            [25, 20, 10, 5, 5, 10, 20, 25],
            [20, 5, -10, -20, -20, -10, 5, 20],
            [15, 5, -20, -20, -20, -20, 5, 15],
            [15, 5, -20, -20, -20, -20, 5, 15],
            [20, 5, -10, -20, -20, -10, 5, 20],
            [25, 20, 10, 5, 5, 10, 20, 25],
            [30, 25, 10, 5, 5, 10, 25, 30]
        ];
    };
    /**
     * Kinght Table For The AI
     */
    Game.prototype.getAIKnightTable = function () {
        return [
            [35, 20, 10, 10, 10, 10, 20, 35],
            [20, -5, -15, -15, -15, -15, -5, 20],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [20, -5, -15, -15, -15, -15, -5, 20],
            [35, 20, 10, 10, 10, 10, 20, 35]
        ];
    };
    /**
     * Rook Table For The AI
     */
    Game.prototype.getAIRookTable = function () {
        return [
            [-2, -2, -2, -2, -2, -2, -2, -2],
            [5, 5, -5, -5, -5, -5, 5, 5],
            [5, 5, -5, -5, -5, -5, 5, 5],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-5, -5, -5, -5, -5, -5, -5, -5],
            [-10, -10, -10, -10, -10, -10, -10, -10],
            [-5, -5, -5, -5, -5, -5, -5, -5]
        ];
    };
    /**
     * Queen Table For The AI
     */
    Game.prototype.getAIQueenTable = function () {
        return [
            [35, 30, 20, 10, 10, 20, 30, 35],
            [30, 25, 15, 5, 5, 15, 25, 30],
            [25, 5, -10, -10, -10, -10, 5, 25],
            [15, -10, -20, -20, -20, -20, -10, 15],
            [15, -10, -20, -20, -20, -20, -10, 15],
            [25, 5, -10, -10, -10, -10, 5, 25],
            [30, 25, 15, 5, 5, 15, 25, 30],
            [35, 30, 20, 10, 10, 20, 30, 35]
        ];
    };
    /**
     * King Table For The AI
     */
    Game.prototype.getAIKingTable = function () {
        return [
            [-30, -30, -50, -50, -50, -50, -30, -30],
            [20, 20, 20, 20, 20, 20, 20, 20],
            [30, 30, 30, 30, 30, 30, 30, 30],
            [40, 40, 40, 40, 40, 40, 40, 40],
            [40, 40, 40, 40, 40, 40, 40, 40],
            [30, 30, 30, 30, 30, 30, 30, 30],
            [40, 40, 40, 40, 40, 40, 40, 40],
            [50, 50, 50, 50, 50, 50, 50, 50]
        ];
    };
    /**
     * King Table For The AI (Endgame)
     */
    Game.prototype.getAIKingTable2 = function () {
        return [
            [30, 30, 30, 30, 30, 30, 30, 30],
            [-10, -10, -10, -10, -10, -10, -10, -10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [10, -15, -35, -35, -35, -35, -15, 10],
            [20, 20, 20, 20, 20, 20, 20, 20],
            [30, 30, 30, 30, 30, 30, 30, 30]
        ];
    };
    /**
     * Calculates a static evaluation for the Board given the positions of pieces and their type.
     * @param {boolean} isAIWhite True if AI is white, False o/w.
     * @param {Board} board Board consisting of cells.
     * @returns Static evaluation for the board configuration.
     */
    Game.prototype.configurationEvaluation = function (board, isAIWhite) {
        var playerEvaluation = 0;
        var aiEvaluation = 0;
        var cells = board.boardCells;
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var cell = cells[row][col];
                var piece = cell.getPiece();
                if (piece !== null) {
                    if (piece.getIsWhite()) {
                        if (piece.getType() === 'Pawn' && !isAIWhite) {
                            playerEvaluation += this.getPawnTableAIBlack()[row][col];
                        }
                        else if (piece.getType() === 'Pawn' && isAIWhite) {
                            playerEvaluation += this.getPawnTableAIWhite()[row][col];
                        }
                        else if (piece.getType() === 'Rook') {
                            playerEvaluation += this.getRookTable()[row][col];
                        }
                        else if (piece.getType() === 'Knight') {
                            playerEvaluation += this.getKnightTable()[row][col];
                        }
                        else if (piece.getType() === 'Bishop') {
                            playerEvaluation += this.getBishopTable()[row][col];
                        }
                        else if (piece.getType() === 'King') {
                            playerEvaluation += this.getKingTable()[row][col];
                        }
                        else if (piece.getType() === 'Queen') {
                            playerEvaluation += this.getQueenTable()[row][col];
                        }
                    }
                    else if (!piece.getIsWhite()) {
                        if (piece.getType() === 'Pawn') {
                            aiEvaluation += this.getAIPawnTable()[row][col];
                        }
                        else if (piece.getType() === 'Rook') {
                            aiEvaluation += this.getAIRookTable()[row][col];
                        }
                        else if (piece.getType() === 'Knight') {
                            aiEvaluation += this.getAIKnightTable()[row][col];
                        }
                        else if (piece.getType() === 'Bishop') {
                            aiEvaluation += this.getAIBishopTable()[row][col];
                        }
                        else if (piece.getType() === 'King') {
                            aiEvaluation += this.getAIKingTable()[row][col];
                        }
                        else if (piece.getType() === 'Queen') {
                            aiEvaluation += this.getAIQueenTable()[row][col];
                        }
                    }
                }
            }
        }
        return aiEvaluation + playerEvaluation;
    };
    /**
     * Calculates a static evaluation for the Piece values.
     * @param {boolean} isAIWhite True if AI is white, False o/w.
     * @param {Board} board Board consisting of cells.
     * @returns Static evaluation for the Piece values.
     */
    Game.prototype.pieceEvaluator = function (board, isAIWhite) {
        var aiEvaluation = 0;
        var playerEvaluation = 0;
        var cells = board.boardCells;
        for (var row = 0; row < cells.length; row++) {
            for (var col = 0; col < cells[row].length; col++) {
                var piece = cells[row][col].getPiece();
                if (piece !== null) {
                    // AI
                    if (!piece.getIsWhite()) {
                        if (piece.getType() === 'Rook' && !isAIWhite) {
                            aiEvaluation += this.getComputerRookValue();
                        }
                        else if (piece.getType() === 'Rook' && isAIWhite) {
                            aiEvaluation += this.getComputerRookValueSwitch();
                        }
                        else if (piece.getType() === 'Knight' && !isAIWhite) {
                            aiEvaluation += this.getComputerKnightValue();
                        }
                        else if (piece.getType() === 'Knight' && isAIWhite) {
                            aiEvaluation += this.getComputerKnightValueSwitch();
                        }
                        else if (piece.getType() === 'Bishop' && !isAIWhite) {
                            aiEvaluation += this.getComputerBishopValue();
                        }
                        else if (piece.getType() === 'Bishop' && isAIWhite) {
                            aiEvaluation += this.getComputerBishopValueSwitch();
                        }
                        else if (piece.getType() === 'Queen' && !isAIWhite) {
                            aiEvaluation += this.getComputerQueenValue();
                        }
                        else if (piece.getType() === 'Queen' && isAIWhite) {
                            aiEvaluation += this.getComputerQueenValueSwitch();
                        }
                        else if (piece.getType() === 'King' && !isAIWhite) {
                            aiEvaluation += this.getComputerKingValue();
                        }
                        else if (piece.getType() === 'King' && isAIWhite) {
                            aiEvaluation += this.getComputerKingValueSwitch();
                        }
                        else if (piece.getType() === 'Pawn' && !isAIWhite) {
                            aiEvaluation += this.getComputerPawnValue();
                        }
                        else if (piece.getType() === 'Pawn' && isAIWhite) {
                            aiEvaluation += this.getComputerPawnValueSwitch();
                        }
                    }
                    //Player
                    else {
                        if (piece.getType() === 'Rook' && !isAIWhite) {
                            playerEvaluation += this.getRookValue();
                        }
                        else if (piece.getType() === 'Rook' && isAIWhite) {
                            playerEvaluation += this.getRookValueSwitch();
                        }
                        else if (piece.getType() === 'Knight' && !isAIWhite) {
                            playerEvaluation += this.getKnightValue();
                        }
                        else if (piece.getType() === 'Knight' && isAIWhite) {
                            playerEvaluation += this.getKnightValueSwitch();
                        }
                        else if (piece.getType() === 'Bishop' && !isAIWhite) {
                            playerEvaluation += this.getBishopValue();
                        }
                        else if (piece.getType() === 'Bishop' && isAIWhite) {
                            playerEvaluation += this.getBishopValueSwitch();
                        }
                        else if (piece.getType() === 'Queen' && !isAIWhite) {
                            playerEvaluation += this.getQueenValue();
                        }
                        else if (piece.getType() === 'Queen' && isAIWhite) {
                            playerEvaluation += this.getQueenValueSwitch();
                        }
                        else if (piece.getType() === 'King' && !isAIWhite) {
                            playerEvaluation += this.getKingValue();
                        }
                        else if (piece.getType() === 'King' && isAIWhite) {
                            playerEvaluation += this.getKingValueSwitch();
                        }
                        else if (piece.getType() === 'Pawn' && !isAIWhite) {
                            playerEvaluation += this.getPawnValue();
                        }
                        else if (piece.getType() === 'Pawn' && isAIWhite) {
                            playerEvaluation += this.getPawnValueSwitch();
                        }
                    }
                }
            }
        }
        return playerEvaluation + aiEvaluation;
    };
    /**
    * Calculates a static evaluation for both the Board and the Piece Values
    * @param {boolean} isAIWhite True if AI is white, False o/w.
    * @param {Board} board Board consisting of cells.
    * @returns Static evaluation for the Bsoard configuration and Piece values.
    */
    Game.prototype.boardEvaluation = function (board, isAIWhite) {
        var pieceEvaluation = this.pieceEvaluator(board, isAIWhite);
        var configurationEvaluation = this.configurationEvaluation(board, isAIWhite);
        return pieceEvaluation + configurationEvaluation;
    };
    /**
    * Builds a board tree starting from the argument board and assigns static evaluations based on the board configuration, piece values, castling, en passant, check, checkmate.
    * @param {number} difficulty The final depth of the tree.
    * @param {boolean} isAIWhite True if AI is white, false, o/w.
    * @returns Board tree object after building.
    */
    Game.prototype.buildBoardTree = function (difficulty, isAIWhite) {
        var rootClone = this.deepCopyBoard(this.board);
        /**
         * THIS AFFECTS WHETHER THE PLAYER PLAYS FIRST OR THE AI PLAYS FIRST
         *
         * IF AI is black, set value to true (initial setting)
         *
         * IF AI is white, set value to false.
         */
        var isTurnWhite = isAIWhite;
        var root = new BoardTree_1.BoardTree(null, rootClone, []);
        var level = -1;
        var enqueueCount = 0;
        var dequeueCount = 0;
        // Queue used for Level Order Traversal.
        var boardTreeQueue = [];
        boardTreeQueue.push(root);
        enqueueCount += 1;
        while (boardTreeQueue.length > 0) {
            var currBoardTree = boardTreeQueue.shift();
            if (dequeueCount > 0) {
                dequeueCount -= 1;
            }
            if (dequeueCount === 0) {
                dequeueCount = enqueueCount;
                enqueueCount = 0;
                level += 1;
                isTurnWhite = !isTurnWhite;
            }
            if (level === difficulty) {
                return root;
            }
            if (currBoardTree !== null && currBoardTree !== undefined) {
                var currBoard = currBoardTree.getCurrentBoard();
                var currBoardCells = currBoard !== null ? currBoard.boardCells : null;
                if (currBoardCells !== null) {
                    // Loop over all 64 cells to find the pieces matching the spcified color.
                    for (var row = 0; row < currBoardCells.length; row++) {
                        for (var col = 0; col < currBoardCells[row].length; col++) {
                            var cell = currBoardCells[row][col];
                            var piece = cell.getPiece();
                            //Check for pieces belonging to the specified color's turn.
                            if (piece !== null && piece.getIsWhite() === isTurnWhite) {
                                //Observe all positions on the board for that specific piece.
                                for (var innerRow = 0; innerRow < currBoardCells.length; innerRow++) {
                                    for (var innerCol = 0; innerCol < currBoardCells[innerRow].length; innerCol++) {
                                        var startCell = currBoardCells[row][col];
                                        var endCell = currBoardCells[innerRow][innerCol];
                                        // make sure the move is valid and will not result in check.
                                        /**
                                         * NB: currBoard is the board before all configuarations are checked.
                                         *
                                         * Example:
                                         *
                                         * startCell: cell containing Rook
                                         * endCell: (64 possible cells)
                                         *
                                         **/
                                        if (currBoard !== null) {
                                            //Check for castling move
                                            var tryingToMakeCastlingMove = this.isCastlingPossible(startCell, endCell, currBoard);
                                            //Check for enPassant move
                                            var isEnPassantPossible = this.performEnPassant(startCell, endCell, currBoard);
                                            var isValidMove = piece.isValidMove(currBoard, startCell, endCell);
                                            var isMovePossible = this.isMovePossible(startCell, endCell, currBoard);
                                            var checkValue = this.isInCheck(startCell, endCell, currBoard);
                                            if (tryingToMakeCastlingMove !== null || isEnPassantPossible !== null) {
                                                isValidMove = true;
                                                isMovePossible = true;
                                            }
                                            //* Make Sure Move Is Valid *//
                                            if (isValidMove && isMovePossible && checkValue.result !== "currentPlayer-will-be-in-check") {
                                                //clone the board.
                                                var clone = this.deepCopyBoard(currBoard);
                                                var cloneCells = clone.boardCells;
                                                var cloneStartCell = cloneCells[row][col];
                                                var cloneEndCell = cloneCells[innerRow][innerCol];
                                                /**
                                                 *  UPDATE THE CELLS AND PIECES ON THE BOARD TREE TO REFLECT THE PREVIOUS STATE OF THE BOARD
                                                 *
                                                 *  SET THE PREVIOUS BOARD (Board before moving from startCell to endCell)
                                                 */
                                                var prevBoard = this.deepCopyBoard(clone);
                                                var prevCells = prevBoard.boardCells;
                                                var prevStartCell = prevCells[row][col];
                                                var prevEndCell = prevCells[innerRow][innerCol];
                                                /*** Evaluating for In-Check  ***/
                                                if (checkValue.result === "opponent-in-check") {
                                                    currBoardTree.setIsCheck(true);
                                                    //Maximize the ROI for putting opponent in check.
                                                    if (isTurnWhite) {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(2000 + currStaticEvaluation);
                                                    }
                                                    else {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(-2000 + currStaticEvaluation);
                                                    }
                                                }
                                                /** Evaluating for Pawn promotion */
                                                var startPiece = cloneStartCell.getPiece();
                                                if (cloneStartCell !== null && startPiece !== null && startPiece.getType() === 'Pawn') {
                                                    if (this.setPawnPromotion(cloneStartCell, cloneEndCell, currBoard)) {
                                                        if (isTurnWhite) {
                                                            var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                            currBoardTree.setStaticEvaluation(300 + currStaticEvaluation);
                                                        }
                                                        else {
                                                            var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                            currBoardTree.setStaticEvaluation(-300 + currStaticEvaluation);
                                                        }
                                                    }
                                                }
                                                /** Evaluating for Castling */
                                                if (tryingToMakeCastlingMove !== null) {
                                                    this.makeCastlingMove(cloneStartCell, cloneEndCell, clone);
                                                }
                                                /** Evaluating for EnPassant */
                                                else if (isEnPassantPossible !== null) {
                                                    if (isTurnWhite) {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(30 + currStaticEvaluation);
                                                    }
                                                    else {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(-30 + currStaticEvaluation);
                                                    }
                                                }
                                                else {
                                                    //remove piece from clone's start cell.
                                                    cloneStartCell.setPiece(null);
                                                    //add piece to clone's end cell.
                                                    cloneEndCell.setPiece(piece);
                                                }
                                                /*** Evaluating for Checkmate ***/
                                                if (this.isCheckmate(checkValue.checkingPieceCell, clone)) {
                                                    currBoardTree.setIsCheckmate(true);
                                                    if (isTurnWhite) {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(100000 + currStaticEvaluation);
                                                    }
                                                    else {
                                                        var currStaticEvaluation = currBoardTree.getStaticEvaluation();
                                                        currBoardTree.setStaticEvaluation(-100000 + currStaticEvaluation);
                                                    }
                                                }
                                                /*** Evaluating for Stalemate  ***/
                                                if (this.stalemateCheck(!isTurnWhite, clone)) {
                                                    currBoardTree.setIsStalemate(true);
                                                }
                                                //Create a new board tree out of the clone.
                                                var newBoardTree = new BoardTree_1.BoardTree(currBoardTree, clone, []);
                                                //Update the board's static evaluation
                                                newBoardTree.setStaticEvaluation(newBoardTree.getStaticEvaluation() + this.boardEvaluation(clone, isTurnWhite));
                                                /** Update the previous board in the new board tree */
                                                newBoardTree.initializeCellsAndPieces(prevStartCell, prevEndCell, prevStartCell.getPiece(), prevEndCell.getPiece());
                                                newBoardTree.setPrevBoard(prevBoard);
                                                //Attach the new board tree as a child to the previously dequed node.
                                                currBoardTree.getChildren().push(newBoardTree);
                                                //Enqueue the clone.
                                                //Update the enqueue count.
                                                boardTreeQueue.push(newBoardTree);
                                                enqueueCount += 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } //All the enqueueing for single node is done at this point.
                }
            }
        }
    };
    /**
    * Makes a deep copy of the board, creating new objects for the board, cells, and pieces.
    * @param {Board} board Board consisting of cells.
    * @returns Static evaluation for the Bsoard configuration and Piece values.
    */
    Game.prototype.deepCopyBoard = function (original) {
        //NB: the copied board has no pieces
        var copy = new board_1.Board(true);
        var originalCells = original.boardCells;
        var copyCells = copy.boardCells;
        //Copies all pieces from original board to copy
        for (var row = 0; row < originalCells.length; row++) {
            for (var col = 0; col < originalCells[row].length; col++) {
                var originalPiece = originalCells[row][col].getPiece();
                copyCells[row][col].setPiece(originalPiece);
            }
        }
        return copy;
    };
    /**
     * Minimax algorithm with alpha beta pruning.
     * @param {BoardTree} root The root of the board tree after building.
     * @param {number} depth The maximum depth to traverse.
     * @param {alpha} number The maximum static evaluation for a given node's subtree.
     * @param {beta} number The minimum static evaluation for a given node's subtree.
     * @param {boolean}  maximizingPlayer true if the player selects white, false if the player selects black.
     * @returns static evaluation that leads to the highest determined value or lowest determined value if white / black respectively.
     */
    Game.prototype.performMinimax = function (root, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 && !isNaN(root.getStaticEvaluation())) {
            return root.getStaticEvaluation();
        }
        if (maximizingPlayer) {
            var maxValue = -1000000;
            for (var i = 0; i < root.getChildren().length; i++) {
                var childNode = root.getChildren()[i];
                maxValue = Math.max(maxValue, this.performMinimax(childNode, depth - 1, alpha, beta, false));
                alpha = Math.max(alpha, maxValue);
                childNode.setStaticEvaluation(maxValue);
                if (alpha >= beta) {
                    break;
                }
            }
            return maxValue;
        }
        else {
            var minValue = 1000000;
            for (var i = 0; i < root.getChildren().length; i++) {
                var childNode = root.getChildren()[i];
                minValue = Math.min(minValue, this.performMinimax(childNode, depth - 1, alpha, beta, true));
                beta = Math.min(beta, minValue);
                childNode.setStaticEvaluation(minValue);
                if (alpha >= beta) {
                    break;
                }
            }
            return minValue;
        }
    };
    /**
     * Breadth First Search Algorithm to explore the first level of the tree. (A bit extra code since only the children of the root will be explored.)
     * @param {BoardTree} root The root of the board tree after building.
     * @param {number} staticEvaluation The best possible resultant evaluation from Minimax.
     * @returns Board tree that leads to the best possible resultant evaluation from Minimax.
     */
    Game.prototype.performBFS = function (root, staticEvaluation) {
        if (root !== null) {
            var queue = [];
            queue.push(root);
            while (queue.length > 0) {
                var boardTree = queue.shift();
                if (boardTree !== undefined) {
                    if (boardTree.getStaticEvaluation() === staticEvaluation) {
                        var bestBoard = boardTree.getCurrentBoard();
                        if (bestBoard !== null) {
                            this.board = bestBoard;
                            return boardTree;
                        }
                    }
                    for (var i = 0; i < boardTree.getChildren().length; i++) {
                        var child = boardTree.getChildren()[i];
                        queue.push(child);
                    }
                }
            }
        }
    };
    /**
    * @returns A 2D array of all 64 position values on the board.
    */
    Game.prototype.getCorrespondingPosition = function () {
        return [
            ['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8'],
            ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7'],
            ['A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6'],
            ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5'],
            ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4'],
            ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3'],
            ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'],
            ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1']
        ];
    };
    return Game;
}());
exports.Game = Game;

},{"./BoardTree":4,"./Queen":11,"./Rook":13,"./board":14}],7:[function(require,module,exports){
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
 * King Class
 */
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    /**
     *
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    function King(isWhite, isPresent) {
        var _this = _super.call(this, isWhite, isPresent, 'King') || this;
        _this.isFirstMove = true;
        _this.isInCheck = false;
        return _this;
    }
    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    King.prototype.isValidMove = function (board, startCell, endCell) {
        var startPiece = startCell.getPiece();
        var endPiece = endCell.getPiece();
        if (startCell === endCell || startPiece === null) {
            return false;
        }
        //make sure the piece at the end cell is either null or a different color from the start piece.        
        if (endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())) {
            var xStart = startCell.getX(); //row value
            var yStart = startCell.getY(); //column value
            if (this.endCellMatch(xStart - 1, yStart, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 1, yStart, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart, yStart - 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart, yStart + 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart - 1, yStart + 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart - 1, yStart - 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 1, yStart + 1, endCell)) {
                return true;
            }
            if (this.endCellMatch(xStart + 1, yStart - 1, endCell)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Determines if the endCell matches a valid position for a King on the board.
     * @param {number} x a valid row position for a King.
     * @param {number} y a valid column position for a King.
     * @param {Cell} endCell Destination position of the Cell.
     * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
     */
    King.prototype.endCellMatch = function (x, y, endCell) {
        if (x === endCell.getX() && y === endCell.getY()) {
            return true;
        }
        return false;
    };
    return King;
}(Piece_1.Piece));
exports.King = King;

},{"./Piece":10}],8:[function(require,module,exports){
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

},{"./Piece":10}],9:[function(require,module,exports){
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

},{"./Piece":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./Piece":10}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Quote = /** @class */ (function () {
    function Quote(quote) {
        this.quote = quote;
    }
    Quote.prototype.getQuote = function () {
        return this.quote;
    };
    return Quote;
}());
exports.Quote = Quote;

},{}],13:[function(require,module,exports){
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

},{"./Piece":10}],14:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./Bishop":2,"./Cell":5,"./King":7,"./Knight":8,"./Pawn":9,"./Queen":11,"./Rook":13,"dup":3}],15:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Highlights the HTML piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addPieceHighlight = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.add("apply-cell-click");
            cell.children[count].classList.remove("apply-wrong-cell");
        }
    }
};
/**
 * Removes the highlight for the HTML piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.removePieceHighlight = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.remove("apply-cell-click");
        }
    }
};
/**
 * Adds the red shake CSS class on the piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addWrongCellAnimation = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.add("apply-wrong-cell");
        }
        cell.classList.add("apply-wrong-cell-background");
        setTimeout(function () {
            cell.classList.remove("apply-wrong-cell-background");
        }, 600);
    }
};
/**
 * Removes the red shake CSS class on the piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.removeWrongCellAnimation = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.remove("apply-wrong-cell");
        }
        cell.classList.add("apply-wrong-cell-background");
        setTimeout(function () {
            cell.classList.remove("apply-wrong-cell-background");
        }, 600);
    }
};
/**
 * Adds the blue background on the cell containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addMovingCellAnimationCapture = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        cell.classList.add("apply-moving-cell-background-capture");
        setTimeout(function () {
            cell.classList.remove("apply-moving-cell-background-capture");
        }, 500);
    }
};
/**
 * Adds the green background on the cell containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addMovingCellAnimationNoCapture = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        cell.classList.add("apply-moving-cell-background-nocapture");
        setTimeout(function () {
            cell.classList.remove("apply-moving-cell-background-nocapture");
        }, 500);
    }
};
/**
 * Inserts a quote string into the HTML
 *
 * @param {string} quote The quote to insert into the HTML.
 */
exports.setQuote = function (quote) {
    var targetHTML = "<div class='quote'> " + quote + " </div>";
    var nav = document.querySelector('nav');
    if (nav) {
        var prevQuote = document.querySelector('.quote');
        if (prevQuote) {
            prevQuote.remove();
        }
        nav.insertAdjacentHTML('afterend', targetHTML);
    }
};
/**
 * Inserts a piece by setting the specified image display to inline.
 *
 * @param {string} cellNumber The cell location to insert the image.
 * @param {string} piece The piece to insert.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
exports.insertPiecePlayerFast = function (cellNumber, piece, isWhite) {
    var color = isWhite === true ? 'W' : 'B';
    var targetImg = document.querySelector("." + piece + color + "Img" + cellNumber);
    if (targetImg) {
        targetImg.style.display = 'inline';
    }
};
/**
 * Removes a piece by setting the specified image display to none.
 *
 * @param {string} cellNumber The cell location to remove the image.
 * @param {string} piece The piece to remove.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
exports.removePiecePlayerFast = function (cellNumber, piece, isWhite) {
    var color = isWhite === true ? 'W' : 'B';
    var targetImg = document.querySelector("." + piece + color + "Img" + cellNumber);
    if (targetImg) {
        targetImg.style.display = 'none;';
        targetImg.classList.remove('apply-wrong-cell');
    }
};
/**
 * Removes all pieces on the specified cell, cellNumber
 *
 * @param {string} cellNumber The cell location to insert the cell piece.
 */
exports.removeAllPiecePlayerFast = function (cellNumber) {
    var img0 = document.querySelector(".PawnWImg" + cellNumber);
    var img1 = document.querySelector(".PawnBImg" + cellNumber);
    var img2 = document.querySelector(".RookWImg" + cellNumber);
    var img3 = document.querySelector(".RookBImg" + cellNumber);
    var img4 = document.querySelector(".KnightWImg" + cellNumber);
    var img5 = document.querySelector(".KnightBImg" + cellNumber);
    var img6 = document.querySelector(".BishopWImg" + cellNumber);
    var img7 = document.querySelector(".BishopBImg" + cellNumber);
    var img8 = document.querySelector(".QueenWImg" + cellNumber);
    var img9 = document.querySelector(".QueenBImg" + cellNumber);
    var img10 = document.querySelector(".KingWImg" + cellNumber);
    var img11 = document.querySelector(".KingBImg" + cellNumber);
    if (img0 && img1 && img2 && img3 && img4 && img5 && img6 && img7 && img8 && img9 && img10 && img11) {
        img0.style.display = 'none';
        img1.style.display = 'none';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'none';
        img5.style.display = 'none';
        img6.style.display = 'none';
        img7.style.display = 'none';
        img8.style.display = 'none';
        img9.style.display = 'none';
        img10.style.display = 'none';
        img11.style.display = 'none';
        img0.classList.remove("apply-wrong-cell");
        img1.classList.remove("apply-wrong-cell");
        img2.classList.remove("apply-wrong-cell");
        img3.classList.remove("apply-wrong-cell");
        img4.classList.remove("apply-wrong-cell");
        img5.classList.remove("apply-wrong-cell");
        img6.classList.remove("apply-wrong-cell");
        img7.classList.remove("apply-wrong-cell");
        img8.classList.remove("apply-wrong-cell");
        img9.classList.remove("apply-wrong-cell");
        img10.classList.remove("apply-wrong-cell");
        img11.classList.remove("apply-wrong-cell");
    }
};
/**
 * Inserts all images into the HTML for faster loading when moving pieces.
 */
exports.insertImagesForFastLoading = function () {
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            var targetCell = document.querySelector(".cell-" + row + col);
            if (targetCell) {
                targetCell.insertAdjacentHTML("afterbegin", "<!-- Images For Loading Quickly Start -->\n                <img class=\"chess-piece pawnWImg" + row + col + " PawnWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/PawnW.svg\" alt=\"Pawn\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece pawnBImg" + row + col + " PawnBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/PawnB.svg\" alt=\"Pawn\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece queenWImg" + row + col + " QueenWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/QueenW.svg\" alt=\"Queen\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece queenBImg" + row + col + " QueenBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/QueenB.svg\" alt=\"Queen\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece kingWImg" + row + col + " KingWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KingW.svg\" alt=\"King\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece kingBImg" + row + col + " KingBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KingB.svg\" alt=\"King\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece bishopWImg" + row + col + " BishopWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/BishopW.svg\" alt=\"Bishop\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece bishopBImg" + row + col + " BishopBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/BishopB.svg\" alt=\"Bishop\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece kingWImg" + row + col + " KnightWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KnightW.svg\" alt=\"Knight\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece kingBImg" + row + col + " KnightBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KnightB.svg\" alt=\"Knight\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece rookWImg" + row + col + " RookWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/RookW.svg\" alt=\"Rook\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece rookBImg" + row + col + " RookBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/RookB.svg\" alt=\"Rook\" data-ispiecewhite=\"false\">\n                <!-- Images For Loading Quickly End -->");
            }
        }
    }
};
/**
 * Removes a piece represented by an HTML Element on the board
 *
 * @param {Number} cellNumber The cell location to insert the cell piece.
 */
exports.removePiece = function (cellNumber) {
    var targetCell = document.querySelector(".cell-" + cellNumber);
    if (targetCell && targetCell.firstChild) {
        targetCell.removeChild(targetCell.firstChild);
    }
};
/**
 * Displays a modal in the middle of the board when the player / opponent is in check.
 *
 * @param {string} whoIsInCheck A string containing whoever is in check.
 */
exports.checkModal = function (whoIsInCheck) {
    var modal = document.querySelector("." + whoIsInCheck);
    if (modal) {
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout(function () {
            if (modal) {
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, whoIsInCheck === "player-checkmate-modal" || whoIsInCheck === "AI-checkmate-modal" ? 4000 : 1200);
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI moves/captures.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 *
 */
exports.insertGameLog = function (isAI, startCell, endCell, game) {
    if (startCell !== null && endCell !== null) {
        var startX = startCell.getX();
        var startY = startCell.getY();
        var endX = endCell.getX();
        var endY = endCell.getY();
        var gamePosition = game.getCorrespondingPosition();
        var isCapture = endCell.getPiece() !== null;
        var container = document.querySelector(".game-log");
        if (container) {
            var endPiece = endCell.getPiece();
            var startPiece = startCell.getPiece();
            if (isAI && startPiece !== null) {
                if (isCapture && endPiece !== null) {
                    container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> captured your " + endPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
                else {
                    container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> moved its " + startPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
            }
            else if (startPiece !== null) {
                if (isCapture && endPiece !== null) {
                    container.insertAdjacentHTML("beforeend", "<div class='log player-log'> <span class='player-name'>You</span> captured AI's " + endPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
                else {
                    container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> moved your " + startPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
            }
            container.scrollTop = container.scrollHeight;
        }
    }
};
/**
 *  Removes the existing game log if 'New Game' is clicked.
 *
 */
exports.removeGameLog = function () {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI is in Check/Checkmate/Stalemate.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isInCheck True if the Player/AI is in Check, False o/w.
 * @param {boolean} isInCheckmate True if the Player/AI is in Checkmate, False o/w.
 * @param {boolean} isInStalemate True if the Player/AI is in Stalemate, False o/w.
 *
 */
exports.insertSpecialLog = function (isAI, isInCheck, isInCheckmate, isInStalemate) {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        if (isAI) {
            if (isInCheckmate) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Checkmate </div>");
            }
            else if (isInCheck) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Check </div>");
            }
            else if (isInStalemate) {
                container.insertAdjacentHTML("beforeend", "<div class='log'> Game is in Stalemate </div>");
            }
        }
        else {
            if (isInCheckmate) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> placed AI in Checkmate </div>");
            }
            else if (isInCheck) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> placed AI in Check </div>");
            }
            else if (isInStalemate) {
                container.insertAdjacentHTML("beforeend", "<div class='log'> Game is in Stalemate </div>");
            }
        }
        container.scrollTop = container.scrollHeight;
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI has made a castling move.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isKingside True if the Player/AI made a Kingside castle, False if the Player/AI made a Queenside castle.
 *
 */
exports.insertCastlingLog = function (isAI, isKingside) {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        if (isAI) {
            if (isKingside) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> performed Kingside Castling </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> performed Queenside Castling </div>");
            }
        }
        else {
            if (isKingside) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> performed Kingside Castling </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> performed Queenside Castling </div>");
            }
        }
        container.scrollTop = container.scrollHeight;
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI makes an en passant move.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 *
 */
exports.isEnPassantLog = function (isAI, startCell, endCell, game) {
    if (startCell !== null && endCell !== null) {
        var startX = startCell.getX();
        var startY = startCell.getY();
        var endX = endCell.getX();
        var endY = endCell.getY();
        var gamePosition = game.getCorrespondingPosition();
        var container = document.querySelector(".game-log");
        if (container !== null) {
            if (isAI) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> made En passant capture (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ") </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> made En passant capture (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ") </div>");
            }
            container.scrollTop = container.scrollHeight;
        }
    }
};
/**
 * Inserts a modal into the HTML for when the player/AI is in Stalemate.
 *
 */
exports.stalemateModal = function () {
    var modal = document.querySelector(".stalemate-modal");
    if (modal) {
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout(function () {
            if (modal) {
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, 3000);
    }
};
/**
 * Disables a button on the Screen (except Level).
 *
 * @param {string} button The CSS class for the button that need to be disabled.
 *
 */
exports.disableButtonView = function (button) {
    var btn = document.querySelector("." + button);
    btn.classList.add("disable-btn");
};
/**
 * Disables the level button on the Screen.
 *
 * @param {string} button The CSS class for the disable button class.
 *
 */
exports.disableLevelButton = function (button) {
    var disableBtn = document.querySelector("#" + button);
    var btn = document.querySelectorAll("#select-level .level-dropdown");
    disableBtn.classList.add("disable-btn");
    btn.forEach(function (e) {
        var element = e;
        element.style.color = '#c9c9c9';
        element.style.borderColor = '#c9c9c9';
    });
};
/**
 * Enables the level button on the Screen.
 *
 * @param {string} button The CSS class for the disable button class.
 *
 */
exports.enableLevelButton = function (button) {
    var disableBtn = document.querySelector("#" + button);
    var btn = document.querySelectorAll("#select-level .level-dropdown");
    disableBtn.classList.remove("disable-btn");
    btn.forEach(function (e) {
        var element = e;
        element.style.removeProperty('color');
        element.style.removeProperty('border-color');
    });
};
/**
 * Removes the possiblity to click the board and buttons (except New Game) when the game is in Checkmate/Stalemate.
 *
 */
exports.checkmateStalemateEnable = function () {
    var cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.setProperty("pointer-events", "none");
        for (var count = 0; count < 12; count++) {
            if (cell.children[count] !== null) {
                var piece = cell.children[count];
                var htmlPieceElement = piece;
                if (piece !== undefined) {
                    htmlPieceElement.style.setProperty("filter", "invert(41%) sepia(64%) saturate(0%) hue-rotate(185deg) brightness(97%) contrast(93%)");
                }
            }
        }
    });
    var cellsDark = document.querySelectorAll(".chess-dark");
    cellsDark.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.setProperty("background-color", "lightgray");
    });
    var board = document.querySelector(".board");
    board.style.setProperty("border", "12px solid rgba(169,169,169, 0.7)");
    var switchColorBtn = document.querySelector(".switchColor");
    switchColorBtn.classList.add("disable-btn");
    var resignBtn = document.querySelector(".resign");
    resignBtn.classList.add("disable-btn");
};
/**
 * Enables the possiblity to click the board and buttons.
 *
 */
exports.checkmateDisable = function () {
    var cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.removeProperty("pointer-events");
        for (var count = 0; count < 12; count++) {
            if (cell.children[count] !== null) {
                var piece = cell.children[count];
                var htmlPieceElement = piece;
                if (piece !== undefined) {
                    htmlPieceElement.style.removeProperty("filter");
                }
            }
        }
    });
    var cellsDark = document.querySelectorAll(".chess-dark");
    cellsDark.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.removeProperty("background-color");
    });
    var board = document.querySelector(".board");
    board.style["border"] = "12px solid #a09af160";
    var switchColorBtn = document.querySelector(".switchColor");
    switchColorBtn.classList.remove("disable-btn");
    var resignBtn = document.querySelector(".resign");
    resignBtn.classList.remove("disable-btn");
};
/**
 * IN PROGRESS.
 * Sets up a move animation when the Player/AI makes a move.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {boolean} isWhite True if the Piece is white, false o/w.
 */
exports.moveAnimation = function (startCell, endCell, isWhite) {
    var startPiece = startCell.getPiece();
    var color = isWhite === true ? 'W' : 'B';
    var targetHTML = "<img class=\"chess-piece\" src=\"./css/assets/" + startPiece + color + ".svg\" alt=\"" + startPiece + "\" data-ispiecewhite=" + isWhite + ">";
};

},{}]},{},[1]);
