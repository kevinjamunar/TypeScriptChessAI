import { Piece } from "./Piece";
import { Cell } from "./Cell";
import { Board } from "./board";
/**
 * Bishop Class
 */
class Bishop extends Piece{
    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    constructor(isWhite:boolean, isPresent:boolean){
        super(isWhite, isPresent, 'Bishop');
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
        if(endPiece === null || (endPiece.getIsWhite() !== startPiece.getIsWhite())){
            
            let xStart:number = startCell.getX(); //row value
            let yStart:number = startCell.getY(); //column value
            const MIN:number = 0;
            const MAX:number = 7;

            let xCurrent:number = xStart;
            let yCurrent:number = yStart;

            //Diagonal Checks
            for(var i=MIN; i<=MAX; i++){
                xCurrent -= 1;
                yCurrent += 1;
                if(this.endCellMatch(xCurrent, yCurrent, endCell)){
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for(var i=MIN; i<=MAX; i++){
                xCurrent -= 1;
                yCurrent -= 1;
                if(this.endCellMatch(xCurrent, yCurrent, endCell)){
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for(var i=MIN; i<=MAX; i++){
                xCurrent += 1;
                yCurrent -= 1;
                if(this.endCellMatch(xCurrent, yCurrent, endCell)){
                    return true;
                }
            }
            xCurrent = xStart;
            yCurrent = yStart;
            for(var i=MIN; i<=MAX; i++){
                xCurrent += 1;
                yCurrent += 1;
                if(this.endCellMatch(xCurrent, yCurrent, endCell)){
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Determines if the endCell matches a valid position for a Bishop on the board.
     * @param {number} x a valid row position for a Bishop.
     * @param {number} y a valid column position for a Bishop.
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
export {Bishop};