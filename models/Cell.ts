import { Piece } from "./Piece";
/**
 * Creates a new Cell on the Board.
 */
 class Cell{
     private piece: Piece | null;
     private x: number;
     private y: number;

    /**
     * 
     * @param {Piece} piece Piece object associated with a given Cell object.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     */
     constructor(piece: Piece | null, x:number, y:number){
        this.piece = piece; 
        this.x = x;
        this.y = y;
     }
    /**
     * @return {Piece} Piece object in the cell.
     */
     getPiece(){
         return this.piece;
     }

     /**
      * @return {number} Horizontal position for cell.
      */
     getX(){
         return this.x;
     }

     /**
      * @return {number} Vertical position for cell.
      */
     getY(){
         return this.y;
     }

     /**
      * Set the Piece object for the cell.
      * @param {Piece} piece Accept a Piece reference. 
      */
     setPiece(piece:Piece | null){
         this.piece = piece;
     }

    /**
     * Set the vertical position for the cell.
     * @param {number} x Vertical position for cell.
     */
     setX(x:number){
         this.x = x;
     }

    /**
     * Set the horizontal position for the cell.
     * @param {number} y Horizontal position for cell. 
     */     
     setY(y:number){
         this.y = y;
     }
 }

 export {Cell};