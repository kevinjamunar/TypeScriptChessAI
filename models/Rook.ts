import { Piece } from "./Piece";
import { Cell } from "./Cell";
import { Board } from "./board";
/**
 * Rook Class
 */
class Rook extends Piece{
    isFirstMove: boolean;
    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    constructor(isWhite:boolean, isPresent:boolean){
        super(isWhite, isPresent, 'Rook');
        this.isFirstMove = true;
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
            //same row
            if(startCell.getX() === endCell.getX()){
                return true;
            }
            //same column
            if(startCell.getY() === endCell.getY()){
                return true;
            }  
        }
        return false;
    }   
}

export { Rook }