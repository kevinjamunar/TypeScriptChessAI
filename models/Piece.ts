import {Cell} from './Cell';
import {Board} from './board';

/**
 * Creates a new Piece
 * @param {boolean} isWhite Set true if white and false otherwise
 * @param {boolean} isPresent Set true if a Piece is on the board and false otherwise
 */

abstract class Piece{
    private isWhite: boolean;
    private isPresent: boolean;
    private type: string;

    /**
     * 
     * @param {boolean} isWhite True if Piece white, False otherwise
     * @param {boolean} isPresent True if Piece in on the board, False otherwise
     */
    constructor(isWhite:boolean, isPresent:boolean, type:string){
        this.isWhite = isWhite;
        this.isPresent = isPresent;
        this.type = type;
    }
    /**
     * @return {boolean} True if Piece is white, False otherwise. 
     */
    getIsWhite(){
        return this.isWhite;
    }

    /**
     * @return {boolean} True if cell is on board, False otherwise.
     */
    getIsPresent(){
        return this.isPresent;
    }
    
    /**
     * @return {string} The type of the piece.
     */
    getType(){
        return this.type;
    }
    
    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     */
    setIsWhite(isWhite:boolean){
        this.isWhite = isWhite;
    }

    /**
     * 
     * @param {boolean} isPresent True if Piece is on board, False otherwise.
     */
    setIsPresent(isPresent:boolean){
        this.isPresent = isPresent;
    }

    abstract isValidMove(board: Board, startCell: Cell, endCell: Cell):boolean;
}

export {Piece}