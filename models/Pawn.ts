import { Piece } from "./Piece";
import { Cell } from "./Cell";
import { Board } from "./board";
/**
 * Pawn Class
 */
class Pawn extends Piece{
    isFirstMove: boolean;
    isMovingUp: boolean;
    movingTwoSpots: boolean;
    isEnPassant: boolean; //used for enPassant

    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    constructor(isWhite:boolean, isPresent:boolean, isMovingUp:boolean){
        super(isWhite, isPresent, 'Pawn');
        this.isFirstMove = true;
        this.isMovingUp = isMovingUp;
        this.movingTwoSpots = false;
        this.isEnPassant = false;
    }

    /**
     * Determines if a move is valid.
     * @param {Board} board Board consisting of Cells
     * @param {Cell} startCell Current position(x, y) of the Cell.
     * @param {Cell} endCell Destination position(x, y) of the Cell.
     * @return {boolean} True if the destination position is a valid move, False otherwise.
     */
    isValidMove(board:Board, startCell:Cell, endCell:Cell):boolean{
        let startPiece = startCell.getPiece();
        let endPiece = endCell.getPiece();
        if(startCell === endCell || startPiece === null){
            return false;
        }

        //make sure the piece at the end cell is null
        let xStart:number = startCell.getX(); //row value
        let yStart:number = startCell.getY(); //column value

        //Pawn is moving for the first time
        if(this.isFirstMove){
            if(this.isMovingUp){
                if((this.endCellMatch(xStart-2, yStart, endCell) || this.endCellMatch(xStart-1, yStart, endCell)) && endPiece === null){
                    this.movingTwoSpots = true;
                    if(this.endCellMatch(xStart-2, yStart, endCell)){
                        this.isEnPassant = true;
                    }
                    return true;
                }
                if(this.endCellMatch(xStart-1, yStart-1, endCell) && endPiece !== null){
                    return true;
                }
                if(this.endCellMatch(xStart-1, yStart+1, endCell) && endPiece !== null){
                    return true;
                }
                return false;
            }else{
                if((this.endCellMatch(xStart+2, yStart, endCell) || this.endCellMatch(xStart+1, yStart, endCell)) && endPiece === null){
                    this.movingTwoSpots = true;
                    if(this.endCellMatch(xStart+2, yStart, endCell)){
                        this.isEnPassant = true;
                    }
                    return true;
                }
                if(this.endCellMatch(xStart+1, yStart+1, endCell) && endPiece !== null){
                    return true;
                }
                if(this.endCellMatch(xStart+1, yStart-1, endCell) && endPiece !== null){
                    return true;
                }
                return false
            }
        //Pawn has already made its first move
        }else{
            if(this.isMovingUp){
                if(this.endCellMatch(xStart-1, yStart-1, endCell) && endPiece !== null){
                    this.isEnPassant = false;
                    return true;
                }
                if(this.endCellMatch(xStart-1, yStart+1, endCell) && endPiece !== null){
                    this.isEnPassant = false;
                    return true;
                }
                if(this.endCellMatch(xStart-1, yStart, endCell) && endPiece === null){
                    this.isEnPassant = false;
                    return true;
                }
                return false;
            }else{
                if(this.endCellMatch(xStart+1, yStart+1, endCell) && endPiece !== null){
                    this.isEnPassant = false;
                    return true;
                }
                if(this.endCellMatch(xStart+1, yStart-1, endCell) && endPiece !== null){
                    this.isEnPassant = false;
                    return true;
                }
                if(this.endCellMatch(xStart+1, yStart, endCell) && endPiece === null){
                    this.isEnPassant = false;
                    return true;
                }
                return false;
            }
        }
    }

    /**
     * Determines if the endCell matches a valid position for a Pawn on the board.
     * @param {number} x a valid row position for a Pawn.
     * @param {number} y a valid column position for a Pawn.
     * @param {Cell} endCell Destination position of the Cell.
     * @return {boolean} True if the destination position(x,y) matches the endCell position(x,y), False otherwise.
     */
    private endCellMatch(x:number, y:number, endCell:Cell):boolean{
        if(x === endCell.getX() && y === endCell.getY()){
            return true;
        }
        return false;
    }
}
export {Pawn};