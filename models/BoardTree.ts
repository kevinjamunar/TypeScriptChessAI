import { Board } from "./board";
import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { Game } from "./Game";

class BoardTree{

    private parent: BoardTree | null;
    private currentBoard: Board | null; //The board after moving from the start cell to the end cell.
    private children: BoardTree[];
    private staticEvaluation: number;
    private isCheck: boolean;
    private isCheckmate: boolean;
    private isStalemate: boolean;
    private prevBoard: Board | null;
    private startCell: Cell | null; 
    private endCell: Cell | null;
    private startPiece: Piece | null;
    private endPiece: Piece | null;
    private canEnPassant: boolean;
    private lowestStaticEvaluation: number;
    private highestStaticEvaluation: number;


    constructor(parent: BoardTree | null, currentBoard: Board | null, children: BoardTree[]){
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
    getParent(){
        return this.parent;
    }
    getCurrentBoard(){
        return this.currentBoard;
    }
    getChildren(){
        return this.children;
    }
    getStaticEvaluation(){
        return this.staticEvaluation;
    }
    getIsCheck(){
        return this.isCheck;
    }
    getIsCheckmate(){
        return this.isCheckmate;
    }
    getIsStalemate(){
        return this.isStalemate;
    }
    getPrevBoard(){
        return this.prevBoard;
    }
    getStartCell(){
        return this.startCell;
    }
    getEndCell(){
        return this.endCell;
    }
    getStartPiece(){
        return this.startPiece;
    }
    getEndPiece(){
        return this.endPiece;
    }
    getEnPassant(){
        return this.canEnPassant;
    }
    getLowestStaticEvaluation(){
        return this.lowestStaticEvaluation;
    }
    getHighestStaticEvaluation(){
        return this.highestStaticEvaluation;
    }


    /**  
     * SETTERS
    */
    setParent(parent: BoardTree){
        this.parent = parent;
    }
    setCurrentBoard(currentBoard: Board){
        this.currentBoard = currentBoard;
    }
    setChildren(children: [BoardTree]){
        this.children = children;
    }
    setStaticEvaluation(staticEvaluation: number){
        this.staticEvaluation = staticEvaluation;
    }
    setIsCheck(isCheck: boolean){
        this.isCheck = isCheck;
    }
    setIsCheckmate(isCheckmate: boolean){
        this.isCheckmate = isCheckmate;
    }
    setIsStalemate(isStalemate: boolean){
        this.isStalemate = isStalemate;
    }
    setPrevBoard(prevBoard: Board | null){
        this.prevBoard = prevBoard;
    }
    setStartCell(startCell: Cell | null){
        this.startCell = startCell;
    }
    setEndCell(endCell: Cell | null){
        this.endCell = endCell;
    }
    setStartPiece(startPiece: Piece | null){
        this.startPiece = startPiece;
    }
    setEndPiece(endPiece: Piece | null){
        this.endPiece = endPiece;
    }
    setEnPassant(canEnPassant: boolean){
        this.canEnPassant = canEnPassant;
    }
    setLowestStaticEvaluation(lowestStaticEvaluation: number){
        this.lowestStaticEvaluation = lowestStaticEvaluation;
    }
    setHighestStaticEvaluation(highestStaticEvaluation: number){
        this.highestStaticEvaluation = highestStaticEvaluation;
    }
    /**    
     * Adds child to the tree.
     * 
     * @param {BoardTree} child Child of the currBoardTree
     * 
     */
    addChildToTree(child: BoardTree){
        this.children.push(child);
    }

    /**    
     * Initializes the cells and pieces of the previous board.
     * 
     * @param {Cell} startCell The cell of the piece before moving.
     * @param {Cell} endCell The cell of the piece after moving.
     * @param {Piece} startPiece The Piece located at the startCell.
     * @param {Piece} endPiece The Piece located at the endCell.
     * 
     */
    initializeCellsAndPieces(startCell: Cell | null, endCell: Cell | null, startPiece: Piece | null, endPiece: Piece | null){
        this.startCell = startCell;
        this.endCell = endCell;
        this.startPiece = startPiece;
        this.endPiece = endPiece;
    }

}
export {BoardTree};