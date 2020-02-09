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
