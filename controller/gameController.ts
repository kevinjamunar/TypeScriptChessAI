import * as gameView from '../view/gameView';
import {Piece} from "../models/Piece";
import {Rook} from "../models/Rook";
import {Pawn} from "../models/Pawn";
import {Queen} from "../models/Queen";
import {King} from "../models/King";
import {Bishop} from "../models/Bishop";
import {Knight} from "../models/Knight";
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import {Game} from '../models/Game';
import {Quote} from '../models/Quote';
import { BoardTree } from '../models/BoardTree';


/**
 * Quote Setup
 */
let quotes: Quote[] = [];

quotes.push(new Quote(`<q cite="https://www.ichess.net/blog/chess-quotes/">Even a poor plan is better than no plan at all.</q> - <cite> Mikhail Chigorin </cite> `))
quotes.push(new Quote(`<q cite="https://www.ichess.net/blog/chess-quotes/">Tactics is knowing what to do when there is something to do; strategy is knowing what to do when there is nothing to do.</q> - <cite> Savielly Tartakower </cite>`))
quotes.push(new Quote(`<q cite="https://www.ichess.net/blog/chess-quotes/">In life, as in chess, forethought wins.</q> - <cite> Charles Buxton </cite> `))
quotes.push(new Quote(`<q>A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.</q> - <cite> Alan Turring </cite> `))


gameView.insertImagesForFastLoading();
setInterval(()=>{
    let idx = Math.floor(Math.random() * quotes.length);
    gameView.setQuote(quotes[idx].getQuote());
},8000)

quotes.forEach(quote => {
    gameView.setQuote(quote.getQuote());
})

/**
 * Game Setup
 */

const MAX_LENGTH = 8;
let gameBoard = new Board(true);
const game = new Game(gameBoard);


const state = {
    isGamePlaying: true,
    firstMoveMade: false,
    isPlayerTurn: true,
    isColorWhite: gameBoard.isBottomWhite,
    difficulty: 2
};

const newGameBtn = document.querySelector(`.new-game`) as HTMLElement;
newGameBtn.addEventListener('click', e => {
    e.preventDefault();
    resetGame();
    switchColorBtn.classList.remove(`disable-btn`);
    resignBtn.classList.remove(`disable-btn`);
    gameView.checkmateDisable();
    gameView.removeGameLog();
    gameView.enableLevelButton(`select-level`);

});

/**
 * resignBtn - sets the isGamePlaying propery to false and stops the game
 */
const resignBtn = document.querySelector(`.resign`) as HTMLElement;
resignBtn.addEventListener(`click`, e => {
    e.preventDefault();
    state.isGamePlaying = false;
    switchColorBtn.classList.add(`disable-btn`);
    resignBtn.classList.add(`disable-btn`);
    gameView.checkmateStalemateEnable();
    gameView.disableLevelButton(`select-level`);
});

/**
 * switchColorBtn - switches the piece color for the user between white and black
 */
const switchColorBtn = document.querySelector(`.switchColor`) as HTMLElement;
switchColorBtn.addEventListener('click', e => {
    e.preventDefault();
        gameBoard.isBottomWhite = !gameBoard.isBottomWhite;
        state.isColorWhite = gameBoard.isBottomWhite;
        state.isPlayerTurn = gameBoard.isBottomWhite;
        removeAllPieces();
        intializeBoardData();
        setBoard();

        if(gameBoard.isBottomWhite){
            gameView.disableLevelButton(`select-level`);
        }
        else{
            switchColorBtn.classList.add(`disable-btn`);
            gameView.disableLevelButton(`select-level`);
            state.isPlayerTurn = false;
            aiMakeMove();
        }
});

/**
 * selectLevelBtn - Selects the difficulty to play on
 */
const selectLevelValues = document.querySelector(`.level-values`) as HTMLElement;
const selectLevelDropdown = document.querySelector(`.level-dropdown`) as HTMLElement;

let easyBtn = selectLevelValues.children[0];
let mediumBtn = selectLevelValues.children[1];
let hardBtn = selectLevelValues.children[2];

easyBtn.addEventListener('click', e => {
    e.preventDefault();
    state.difficulty = 1;
    selectLevelDropdown.innerHTML = "Easy &darr;";
})

mediumBtn.addEventListener('click', e => {
    e.preventDefault();
    state.difficulty = 2;
    selectLevelDropdown.innerHTML = "Medium &darr;";
})

hardBtn.addEventListener('click', e => {
    e.preventDefault();
    state.difficulty = 3;
    selectLevelDropdown.innerHTML = "Hard &darr;";
})

/**
 * Resets the board's data and view.
 */
function resetGame(){
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
function intializeBoardData(){
    gameBoard.initializeBoardTop();
    gameBoard.initializeBoardBottom();    
}

/**
 * Removes all pieces from the data model and the view.
 */
function removeAllPieces(){;
    for(let row=0; row<MAX_LENGTH; row++){
        for(let col=0; col<MAX_LENGTH; col++){
            gameBoard.boardCells[row][col].setPiece(null);
            gameView.removeAllPiecePlayerFast("" + row + col);
        }
    }
}
/**
 * Updates the view to match data model after initializing the board.
 */
function setBoard() {
    let piece;
    for(let row=0; row<MAX_LENGTH; row++){
        for(let col=0; col<MAX_LENGTH; col++){
            piece = gameBoard.boardCells[row][col].getPiece();
            let cell = document.querySelector(`.cell-${row}${col}`);
            if(piece !== null){
                gameView.removeAllPiecePlayerFast("" + row + col);
                gameView.insertPiecePlayerFast("" + row + col, piece.getType(), piece.getIsWhite());
                if(cell){
                    cell.children[0].setAttribute(`data-ispiecewhite`, `${piece.getIsWhite()}`)
                }
            }
            if(cell !== null){
                cell.setAttribute(`data-cellid`, `${row}${col}`);
            }
        }
    }
}

/**
 * Player Move Functionality
*/
function makeMove(){

    //PLAYERS TURN 
        let cells = document.querySelectorAll(`.cell`);
        let startCell: HTMLElement| null = null;
        let endCell: HTMLElement | null = null;

        cells.forEach(cell => {
            cell.addEventListener('click', e => {

                if(state.isPlayerTurn){

                    let isBottomWhite = state.isColorWhite ? 'true' : 'false';

                    let currentTarget = <HTMLElement>e.target;

                    if(startCell === null){
                        if(currentTarget.classList.contains(`chess-piece`)){
                            startCell = currentTarget.parentElement;
                        }else{
                            startCell = currentTarget;
                        }
                        if(currentTarget.dataset.ispiecewhite !== isBottomWhite){ 
                            startCell = null;
                        }
                        else if(startCell !== null && startCell.children.length > 0 && startCell.dataset.cellid !== undefined){
                            let startChild: HTMLElement | null = <HTMLElement>startCell.firstElementChild;
                            if(startChild.dataset.ispiecewhite === isBottomWhite){
                                gameView.addPieceHighlight(startCell.dataset.cellid);
                            }
                        }else{
                            startCell = null;
                        }    
                    }else{
                        if(currentTarget.classList.contains(`chess-piece`)){
                            endCell = currentTarget.parentElement;
                        }else{
                            endCell = currentTarget;
                        }
                    }

                    //use the model to determine if the selected position is valid
                    if(startCell !== null && endCell !== null){

                        if(startCell.dataset.cellid !== undefined && endCell.dataset.cellid !== undefined){
                            let startRowIdx = parseInt(startCell.dataset.cellid[0]);
                            let startColIdx = parseInt(startCell.dataset.cellid[1]);
                            let endRowIdx = parseInt(endCell.dataset.cellid[0]);
                            let endColIdx = parseInt(endCell.dataset.cellid[1]);

                            let modelStartCell: Cell | null = gameBoard.boardCells[startRowIdx][startColIdx];
                            let modelEndCell: Cell | null = gameBoard.boardCells[endRowIdx][endColIdx];

                            let modelStartPiece: Piece | null = modelStartCell.getPiece();

                            if(modelStartCell !== null){
                                if(modelStartPiece !== null){
                                    let isEndPositionValid = modelStartPiece.isValidMove(gameBoard, modelStartCell, modelEndCell);
                                    let isRouteValid = game.isMovePossible(modelStartCell, modelEndCell, game.getBoard());

                                    gameView.removePieceHighlight(startCell.dataset.cellid);

                                    //TEST IF GAME IS IN CHECK
                                    const isInCheck = game.isInCheck(modelStartCell, modelEndCell, game.getBoard());


                                    //TEST IF EN PASSANT IS POSSIBLE
                                    const canEnPassantBeMade = game.performEnPassant(modelStartCell, modelEndCell, game.getBoard());
                                    if(canEnPassantBeMade !== null){
                                        isEndPositionValid = true;
                                        isRouteValid = true;
                                    }

                                    //TEST IF CASTLING IS POSSIBLE
                                    const canCastlingBeMade = game.makeCastlingMove(modelStartCell, modelEndCell, game.getBoard());
                                    if(canCastlingBeMade !== null){
                                        isEndPositionValid = true;
                                        isRouteValid = true;
                                    }

                                    //TEST IF THE POSITION IS IN INVALID POSITION.
                                    if(!isEndPositionValid || !isRouteValid || (isInCheck.result === `currentPlayer-will-be-in-check`)){
                                        gameView.removeAllPiecePlayerFast(startCell.dataset.cellid);
                                        gameView.insertPiecePlayerFast(startCell.dataset.cellid, modelStartPiece.getType(), modelStartPiece.getIsWhite());
                                       
                                        gameView.removeWrongCellAnimation(startCell.dataset.cellid);
                                        gameView.addWrongCellAnimation(startCell.dataset.cellid);


                                        //TESTING IF THE PLAYER IS IN CHECK.
                                        if(isInCheck.result === `currentPlayer-will-be-in-check`){

                                            gameView.checkModal(`player-check-modal`);

                                        }   
	                                /****************************************************************************************************************************************** */
                                    /** AT THIS POINT, THE POSITION THE PLAYER WANTS TO MOVE IS VALID **/
                                    /****************************************************************************************************************************************** */
                                    }else{
                                        if(canEnPassantBeMade === null){
                                            gameView.insertGameLog(false, modelStartCell, modelEndCell, game);
                                        }
                                        if(modelEndCell.getPiece() !== null){
                                            gameView.addMovingCellAnimationCapture(startCell.dataset.cellid);
                                            gameView.addMovingCellAnimationCapture(endCell.dataset.cellid);    
                                        }else{
                                            gameView.addMovingCellAnimationNoCapture(startCell.dataset.cellid);
                                            gameView.addMovingCellAnimationNoCapture(endCell.dataset.cellid); 
                                        }
                                        

                                        //TESTING FOR AND SETTING PAWN PROMOTION
                                        game.setPawnPromotion(modelStartCell, modelEndCell, game.getBoard());

                                        gameView.disableButtonView(`switchColor`);
                                        gameView.disableLevelButton(`select-level`);

                                        state.isPlayerTurn = !state.isPlayerTurn;

                                        //IF EN PASSANT IS POSSIBLE - UPDATE UI
                                        if(canEnPassantBeMade !== null){
                                            let pawnCell = canEnPassantBeMade;
                                            gameView.removeAllPiecePlayerFast("" + pawnCell.getX() + pawnCell.getY());
                                            gameView.isEnPassantLog(false, modelStartCell, modelEndCell, game);
                                        }

                                        //IF CASTLING IS POSSIBLE - UPDATE UI
                                        if(canCastlingBeMade !== null){
                                            game.makeCastlingMove(modelStartCell, modelEndCell, gameBoard);

                                            let oldKingCell = canCastlingBeMade.oldKingCell;
                                            let newKingCell = canCastlingBeMade.newKingCell;
                                            let oldRookCell = canCastlingBeMade.oldRookCell;
                                            let newRookCell = canCastlingBeMade.newRookCell;

                                            //UPDATE THE VIEW
                                            let newKingPiece = newKingCell.getPiece();
                                            let newRookPiece = newRookCell.getPiece();
                                            if(newKingPiece !== null && newRookPiece !== null){
                                                gameView.removeAllPiecePlayerFast("" + oldKingCell.getX() + oldKingCell.getY());
                                                gameView.removeAllPiecePlayerFast("" + oldRookCell.getX() + oldRookCell.getY());
                                                gameView.insertPiecePlayerFast("" + newKingCell.getX() + newKingCell.getY(), newKingPiece.getType(), newKingPiece.getIsWhite());
                                                gameView.insertPiecePlayerFast("" + newRookCell.getX() + newRookCell.getY(), newRookPiece.getType(), newRookPiece.getIsWhite());    
                                                gameView.insertCastlingLog(false, newKingCell.getY() < oldKingCell.getY() ? false : true);
                                            }
                                        }

                                        /** REMOVE THE CELL HOVER ANIMATION */
                                        let targetCell: HTMLElement | null = document.querySelector(`.cell-${modelEndCell.getX()}${modelEndCell.getY()}`);
                                        if(targetCell){
                                            targetCell.classList.toggle('cell');
                                            setTimeout(() => {
                                                if(targetCell){
                                                    targetCell.classList.toggle('cell');
                                                }
                                            }, 500); 
                                        }
                                        
                                        let modelStartPiece = modelStartCell.getPiece();
                                        if (modelStartPiece) {
                                            modelStartCell.setPiece(null);
                                            gameView.removeAllPiecePlayerFast("" + modelStartCell.getX() + modelStartCell.getY());
                                        }
                                        
                                    
                                        if(modelStartPiece !== null){
                                            /*
                                                CASTLING ASSURANCE 
                                            If modelStartPiece IS KING / ROOK - set isFirstMove to false.
                                            */
                                            if(modelStartPiece.getType() === `King`){
                                                let king = <King>modelStartPiece;
                                                king.isFirstMove = false;
                                            }
                                            else if(modelStartPiece.getType() === `Rook`){
                                                let rook = <Rook>modelStartPiece;
                                                rook.isFirstMove = false;
                                            }

                                            //REMOVE OPPONENT'S PIECE FROM THE MODEL AND THE VIEW IF IT EXISTS
                                            if(modelEndCell.getPiece() !== null){
                                                var endPiece = modelEndCell.getPiece();
                                                if (endPiece !== null) {
                                                    gameView.removeAllPiecePlayerFast(startCell.dataset.cellid);
                                                }
                                                modelEndCell.setPiece(null);
                                            }
                                            modelEndCell.setPiece(modelStartPiece);
                                            gameView.insertPiecePlayerFast(endCell.dataset.cellid, modelStartPiece.getType().toLowerCase(), modelStartPiece.getIsWhite());

                                            if(modelStartPiece.getType() === 'Pawn'){
                                                let pawn = <Pawn>modelStartPiece;
                                                pawn.isFirstMove = false;
                                            }

                                            if(isInCheck.result === `opponent-in-check`){
                                                const isCheckmate = game.isCheckmate(isInCheck.checkingPieceCell, game.getBoard());

                                                if(isCheckmate){
                                                    gameView.checkModal(`player-checkmate-modal`);
                                                    gameView.checkmateStalemateEnable();

                                                    gameView.insertSpecialLog(false, true, true, false);
                                                    return;
                                                }else{  
                                                    gameView.checkModal(`opponent-check-modal`);
                                                    gameView.insertSpecialLog(false, true, false, false);
                                                }
                                            }
                                            //TEST IF GAME IS IN STALEMATE
                                            const isGameStalemate = game.stalemateCheck(!modelStartPiece.getIsWhite(), game.getBoard());
                                            if(isGameStalemate){
                                                gameView.stalemateModal();
                                                gameView.checkmateStalemateEnable();
                                                gameView.insertSpecialLog(false, false, false, true);
                                                return;
                                            }
                                        }
                                        setBoard();
                                        state.isPlayerTurn = !state.isPlayerTurn;
                                        setTimeout( ()=> {
                                            aiMakeMove();
                                        }, 800)
                                    }
                                }
                            }
                            startCell = null;
                            endCell = null;
                        }
                    }
            } //isPlayerTurn check.
        })
    })
}

/**
 * AI Move Functionality
*/
function aiMakeMove(){
 
    setTimeout( () => {
        /** BUILD BOARD TREE */

        let root: BoardTree | undefined = game.buildBoardTree(state.difficulty, state.isColorWhite);

        /** PERFORM MINIMAX */
        if(root !== undefined){
            
            let staticEvaluation = game.performMinimax(root, state.difficulty, -1000000 , 1000000,state.isColorWhite === true ? false : true);
            // console.log(`aiMakeMove - lowest static evaluation : ${staticEvaluation}`);
            const bestMove = game.performBFS(root, staticEvaluation);

            if(bestMove !== undefined){
                let currentBoard = bestMove.getCurrentBoard();
                if(currentBoard !== null){
                    removeAllPieces();
                    gameBoard = currentBoard;
                    setBoard();
                    /*
                        TESTING FOR CHECK / CHECKMATE
                    */
                    let prevBoard = bestMove.getPrevBoard();
                    let startCell = bestMove.getStartCell();
                    let endCell  = bestMove.getEndCell();
                    let startPiece = bestMove.getStartPiece();
                    let endPiece = bestMove.getEndPiece();

                    /**
                        TESTING FOR EN PASSANT
                    */
                    
                    if(startCell !== null && endCell !== null && prevBoard !== null){

                        /**
                            TESTING FOR CASTLING
                            //If the prev start cell is 2 places to the left or right (col)
                        */

                          //IF CASTLING IS POSSIBLE - UPDATE UI
                        const canCastlingBeMade = game.isCastlingPossible(startCell, endCell, prevBoard);

                        if(canCastlingBeMade !== null){
                            //NB: castling is made in the game model. The curr board already has the cells updated.
                            let currStartCell = currentBoard.boardCells[startCell.getX()][startCell.getY()];
                            let currEndCell  = currentBoard.boardCells[endCell.getX()][endCell.getY()];
                            gameView.insertCastlingLog(true, currStartCell.getY() < currEndCell.getY() ? false : true);
                        }
                        else{
                            gameView.insertGameLog(true, startCell, endCell, game);
                        }
                    }

                    if(startCell !== null && endCell !== null && prevBoard !== null && startPiece !== null){

                        // console.error(`${startPiece.getType()} Moved Is: StartCell: (${startCell.getX()},${startCell.getY()}) to EndCell: (${endCell.getX()},${endCell.getY()})`);
                       
                        // gameView.removePiece(`${pawnCell.getX()}${pawnCell.getY()}`);

                        //CHECK AND UPDATE FOR PAWN PROMOTION
                        let promotedPiece = game.setPawnPromotion(startCell, endCell, prevBoard);
                        if(promotedPiece !== null){
                            //update the current board 
                            gameBoard.boardCells[endCell.getX()][endCell.getY()].setPiece(promotedPiece);
                            setBoard();
                        }

                        if(endPiece === null){
                            gameView.addMovingCellAnimationNoCapture(`${startCell.getX()}${startCell.getY()}`);
                            gameView.addMovingCellAnimationNoCapture(`${endCell.getX()}${endCell.getY()}`);
                        }else{
                            gameView.addMovingCellAnimationCapture(`${startCell.getX()}${startCell.getY()}`);
                            gameView.addMovingCellAnimationCapture(`${endCell.getX()}${endCell.getY()}`);
                         }
                        
                        // currentBoard.printPiecesTest();

                        //TEST IF GAME IS IN CHECK
                        const isInCheck = game.isInCheck(startCell, endCell, prevBoard);
                        const checkingCell = isInCheck.checkingPieceCell;
                        //TEST IF GAME IS IN STALEMATE
                        const isGameStalemate = game.stalemateCheck(true, currentBoard);

                        //TEST IF THE START PIECE IS A PAWN - set the first move to false
                        if(startPiece !== null && startPiece.getType() === 'Pawn'){
                            let pawn = <Pawn>startPiece;
                            pawn.isFirstMove = false;
                        }
                        // TEST FOR CHECK AND CHECKMATE.
                        if(isInCheck.result === `opponent-in-check` && checkingCell !== null) {

                            //NB: The checking cell is an object belonging to the prev board, not the current board, therefore need to be set to the current board.
                            let newCheckingCellX: number = checkingCell.getX();
                            let newCheckingCellY: number = checkingCell.getY();

                            let newCheckingCell = currentBoard.boardCells[newCheckingCellX][newCheckingCellY];
                            const isCheckmate = game.isCheckmate(newCheckingCell, currentBoard);

                            if(isCheckmate){
                                // prevBoard.printPiecesTest();
                                // currentBoard.printPiecesTest();

                                // if(isInCheck.checkingPieceCell !== null){
                                //     console.log(`Checking Piece Cell is : (${checkingCell.getX()},${checkingCell.getY()})`)
                                // }
                                // console.log('Player is in Checkmate!');

                                gameView.checkModal(`AI-checkmate-modal`);
                                gameView.checkmateStalemateEnable();
                                gameView.insertSpecialLog(true, true, true, false);
                                return;
                            }
                            else{
                                // console.log('Player is in Check!');
                                gameView.checkModal(`player-check-modal`);
                                gameView.insertSpecialLog(true, true, false, false);
                            }
                        }
                        // TEST FOR STALEMATE
                        else if(isGameStalemate){
                            gameView.stalemateModal();
                            gameView.checkmateStalemateEnable();
                            gameView.insertSpecialLog(true, false, false, true);
                        }
                    }
                }else{
                    // console.error(`board is null in aiMakeMove`);
                    return;
                }
            }else{
                // console.error(`bestMove is undefined in aiMakeMove`);
                return;
            }
        }
        else{
            // console.error(`root is undefined in aiMakeMove`);
            return;
        }
        state.isPlayerTurn = true;
    }, 0)
}


