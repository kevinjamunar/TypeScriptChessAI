import { Piece } from "./Piece";
import { Cell } from "./Cell";
import { Board } from "./board";
/**
 * Knight Class
 */
class Knight extends Piece{
    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    constructor(isWhite:boolean, isPresent:boolean){
        super(isWhite, isPresent, 'Knight');
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

        //make sure the piece at the end cell is either null or a different color from the start piece.
        if(endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())){
            let xStart:number = startCell.getX(); //row value
            let yStart:number = startCell.getY(); //column value

            if(this.endCellMatch(xStart-2, yStart+1, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart-1, yStart+2, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart-2, yStart-1, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart-1, yStart-2, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart+1, yStart-2, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart+2, yStart-1, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart+2, yStart+1, endCell)){
                return true;
            }
            if(this.endCellMatch(xStart+1, yStart+2, endCell)){
                return true;
            }
        }
        return false;
    }

    /**
     * Determines if the endCell matches a valid position for a Knight on the board.
     * @param {number} x a valid row position for a Knight.
     * @param {number} y a valid column position for a Knight.
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
export {Knight};