import { Cell } from "./Cell";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Knight } from "./Knight";
import { Bishop } from "./Bishop";
import { Queen } from "./Queen";
import { King } from "./King";


class Board{

    boardCells:Cell[][];
    isBottomWhite:boolean;
    private MAX_LENGTH:number;
    
    /**
     * 
     * @param {boolean} isWhite True if Piece is white, False otherwise.
     */
    constructor(isBottomWhite: boolean){
        this.isBottomWhite = isBottomWhite;
        this.MAX_LENGTH = 8;
        this.boardCells = [];
        for(let row=0; row < this.MAX_LENGTH; row++){
            this.boardCells[row] = [];
            for(let col=0; col < this.MAX_LENGTH; col++){
                this.boardCells[row][col] = new Cell(null, row, col);
            }
        }
    }
    
     /**
     * Initializes the bottom of the board with all 16 pieces.
     */
    initializeBoardBottom(){
        this.isBottomWhite ? this.addPieces(6, 7, true) : this.addPieces(6, 7, false);
    }
    /**
     * Initializes the top of the board with all 16 pieces.
     */
    initializeBoardTop(){
        this.isBottomWhite ? this.addPieces(1, 0, false) : this.addPieces(1, 0, true);
    }

     /**
     * Adds initial placement of 16 chess pieces to the board.
     * 
     * @param {number} rowFront The index of the row for pawn placements
     * @param {number} rowBack The index of the row for non-pawn placements
     * @param {boolean} isWhite True if the color of pieces is white, false otherwise.
     */
    private addPieces(rowFront:number, rowBack:number, isWhite:boolean){
        for(let col=0; col<this.MAX_LENGTH; col++){
            this.boardCells[rowFront][col].setPiece(new Pawn(isWhite, true, rowFront === 6 ? true : false));
        }
        this.boardCells[rowBack][0].setPiece(new Rook(isWhite, true));
        this.boardCells[rowBack][7].setPiece(new Rook(isWhite, true));
        this.boardCells[rowBack][1].setPiece(new Knight(isWhite, true));
        this.boardCells[rowBack][6].setPiece(new Knight(isWhite, true));
        this.boardCells[rowBack][2].setPiece(new Bishop(isWhite, true));
        this.boardCells[rowBack][5].setPiece(new Bishop(isWhite, true));
        this.boardCells[rowBack][3].setPiece(new Queen(isWhite, true));
        this.boardCells[rowBack][4].setPiece(new King(isWhite, true));
    }
    /**
     * Prints the Chess Pieces on the board.
     */
    printPiecesTest(){
        let cells = this.boardCells;
        for(let row=0; row<cells.length; row++){
            for(let col=0; col<cells[row].length; col++){
                console.log(this.boardCells[row][col].getPiece());
            }
        }

    }
}

export{ Board };