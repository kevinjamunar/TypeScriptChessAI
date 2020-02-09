import { Cell } from "../models/Cell";
import { Game } from "../models/Game";


/**
 * Highlights the HTML piece containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const addPieceHighlight = (cellID: string) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        for(let count = 0; count < 12; count++){
            cell.children[count].classList.add(`apply-cell-click`);
            cell.children[count].classList.remove(`apply-wrong-cell`);
        }
    }
}

/**
 * Removes the highlight for the HTML piece containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const removePieceHighlight = (cellID: string) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        for(let count = 0; count < 12; count++){
            cell.children[count].classList.remove(`apply-cell-click`);
        }
    }
}

/**
 * Adds the red shake CSS class on the piece containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const addWrongCellAnimation= (cellID: string) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        for(let count = 0; count < 12; count++){
            cell.children[count].classList.add(`apply-wrong-cell`);
        }
        cell.classList.add(`apply-wrong-cell-background`);
        setTimeout( ()=> {
            cell.classList.remove(`apply-wrong-cell-background`);
        }, 600)
    }
}

/**
 * Removes the red shake CSS class on the piece containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const removeWrongCellAnimation = (cellID: string) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        for(let count = 0; count < 12; count++){
            cell.children[count].classList.remove(`apply-wrong-cell`);
        }
        cell.classList.add(`apply-wrong-cell-background`);
        setTimeout( ()=> {
            cell.classList.remove(`apply-wrong-cell-background`);
        }, 600)
    }
}



/**
 * Adds the blue background on the cell containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const addMovingCellAnimationCapture = (cellID: String) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        cell.classList.add(`apply-moving-cell-background-capture`);
        setTimeout( ()=> {
            cell.classList.remove(`apply-moving-cell-background-capture`);
        }, 500)
    }
}

/**
 * Adds the green background on the cell containing the CSS class, cellID
 * 
 * @param {string} cellID The cell with CSS class, cellID.
 */
export const addMovingCellAnimationNoCapture = (cellID: String) => {
    const cell = document.querySelector(`.cell-${cellID}`);
    if(cell){
        cell.classList.add(`apply-moving-cell-background-nocapture`);
        setTimeout( ()=> {
            cell.classList.remove(`apply-moving-cell-background-nocapture`);
        }, 500)
    }
}

/**
 * Inserts a quote string into the HTML
 * 
 * @param {string} quote The quote to insert into the HTML.
 */
export const setQuote = (quote: string) => {
    let targetHTML = 
    `<div class='quote'> ${quote} </div>`
    let nav = document.querySelector('nav');
    if(nav){
        let prevQuote = document.querySelector('.quote');
        if(prevQuote){
            prevQuote.remove();
        }
        nav.insertAdjacentHTML('afterend', targetHTML);
    }
}

/**
 * Inserts a piece by setting the specified image display to inline.
 * 
 * @param {string} cellNumber The cell location to insert the image.
 * @param {string} piece The piece to insert.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
export const insertPiecePlayerFast = (cellNumber: string, piece: string, isWhite: boolean) => {
    let color: string = isWhite === true ? 'W' : 'B';
    let targetImg: HTMLElement | null = document.querySelector(`.${piece}${color}Img${cellNumber}`);
    if(targetImg){
        targetImg.style.display = 'inline';
    }
}

/**
 * Removes a piece by setting the specified image display to none.
 * 
 * @param {string} cellNumber The cell location to remove the image.
 * @param {string} piece The piece to remove.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
export const removePiecePlayerFast = (cellNumber: string, piece: string, isWhite: boolean) => {
    let color: string = isWhite === true ? 'W' : 'B';
    let targetImg: HTMLElement | null = document.querySelector(`.${piece}${color}Img${cellNumber}`);
    if(targetImg){
        targetImg.style.display = 'none;';
        targetImg.classList.remove('apply-wrong-cell');
    }
}

/**
 * Removes all pieces on the specified cell, cellNumber
 * 
 * @param {string} cellNumber The cell location to insert the cell piece.
 */
export const removeAllPiecePlayerFast = (cellNumber: string) => {
    let img0: HTMLElement | null  = document.querySelector(`.PawnWImg${cellNumber}`);
    let img1: HTMLElement | null  = document.querySelector(`.PawnBImg${cellNumber}`);
    let img2: HTMLElement | null  = document.querySelector(`.RookWImg${cellNumber}`);
    let img3: HTMLElement | null  = document.querySelector(`.RookBImg${cellNumber}`);
    let img4: HTMLElement | null  = document.querySelector(`.KnightWImg${cellNumber}`);
    let img5: HTMLElement | null  = document.querySelector(`.KnightBImg${cellNumber}`);
    let img6: HTMLElement | null  = document.querySelector(`.BishopWImg${cellNumber}`);
    let img7: HTMLElement | null  = document.querySelector(`.BishopBImg${cellNumber}`);
    let img8: HTMLElement | null  = document.querySelector(`.QueenWImg${cellNumber}`);
    let img9: HTMLElement | null  = document.querySelector(`.QueenBImg${cellNumber}`);
    let img10: HTMLElement | null  = document.querySelector(`.KingWImg${cellNumber}`);
    let img11: HTMLElement | null  = document.querySelector(`.KingBImg${cellNumber}`);

    if(img0 && img1 && img2 && img3 && img4 && img5 && img6 && img7 && img8 && img9 && img10 && img11){
        img0.style.display = 'none';
        img1.style.display = 'none';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'none';
        img5.style.display = 'none';
        img6.style.display = 'none';
        img7.style.display = 'none';
        img8.style.display = 'none';
        img9.style.display = 'none';
        img10.style.display = 'none';
        img11.style.display = 'none';

        img0.classList.remove(`apply-wrong-cell`);
        img1.classList.remove(`apply-wrong-cell`);
        img2.classList.remove(`apply-wrong-cell`);
        img3.classList.remove(`apply-wrong-cell`);
        img4.classList.remove(`apply-wrong-cell`);
        img5.classList.remove(`apply-wrong-cell`);
        img6.classList.remove(`apply-wrong-cell`);
        img7.classList.remove(`apply-wrong-cell`);
        img8.classList.remove(`apply-wrong-cell`);
        img9.classList.remove(`apply-wrong-cell`);
        img10.classList.remove(`apply-wrong-cell`);
        img11.classList.remove(`apply-wrong-cell`);

    }
}


/**
 * Inserts all images into the HTML for faster loading when moving pieces.
 */
export const insertImagesForFastLoading = () => {
    for(let row=0; row<8; row++){
        for(let col=0; col<8; col++){
            let targetCell: HTMLElement | null = document.querySelector(`.cell-${row}${col}`);
            if(targetCell){
                targetCell.insertAdjacentHTML(`afterbegin`,          
                `<!-- Images For Loading Quickly Start -->
                <img class="chess-piece pawnWImg${row}${col} PawnWImg${row}${col}" style="display: none;" src="./css/assets/PawnW.svg" alt="Pawn" data-ispiecewhite="true">
                <img class="chess-piece pawnBImg${row}${col} PawnBImg${row}${col}" style="display: none;" src="./css/assets/PawnB.svg" alt="Pawn" data-ispiecewhite="false">
                <img class="chess-piece queenWImg${row}${col} QueenWImg${row}${col}" style="display: none;" src="./css/assets/QueenW.svg" alt="Queen" data-ispiecewhite="true">
                <img class="chess-piece queenBImg${row}${col} QueenBImg${row}${col}" style="display: none;" src="./css/assets/QueenB.svg" alt="Queen" data-ispiecewhite="false">
                <img class="chess-piece kingWImg${row}${col} KingWImg${row}${col}" style="display: none;" src="./css/assets/KingW.svg" alt="King" data-ispiecewhite="true">
                <img class="chess-piece kingBImg${row}${col} KingBImg${row}${col}" style="display: none;" src="./css/assets/KingB.svg" alt="King" data-ispiecewhite="false">
                <img class="chess-piece bishopWImg${row}${col} BishopWImg${row}${col}" style="display: none;" src="./css/assets/BishopW.svg" alt="Bishop" data-ispiecewhite="true">
                <img class="chess-piece bishopBImg${row}${col} BishopBImg${row}${col}" style="display: none;" src="./css/assets/BishopB.svg" alt="Bishop" data-ispiecewhite="false">
                <img class="chess-piece kingWImg${row}${col} KnightWImg${row}${col}" style="display: none;" src="./css/assets/KnightW.svg" alt="Knight" data-ispiecewhite="true">
                <img class="chess-piece kingBImg${row}${col} KnightBImg${row}${col}" style="display: none;" src="./css/assets/KnightB.svg" alt="Knight" data-ispiecewhite="false">
                <img class="chess-piece rookWImg${row}${col} RookWImg${row}${col}" style="display: none;" src="./css/assets/RookW.svg" alt="Rook" data-ispiecewhite="true">
                <img class="chess-piece rookBImg${row}${col} RookBImg${row}${col}" style="display: none;" src="./css/assets/RookB.svg" alt="Rook" data-ispiecewhite="false">
                <!-- Images For Loading Quickly End -->`
                )
            }
        }
    }
}

/**
 * Removes a piece represented by an HTML Element on the board
 * 
 * @param {Number} cellNumber The cell location to insert the cell piece.
 */
export const removePiece = (cellNumber: string) => {
    let targetCell: HTMLElement | null = document.querySelector(`.cell-${cellNumber}`);
    if(targetCell && targetCell.firstChild){
        targetCell.removeChild(targetCell.firstChild);
    }
}

/**
 * Displays a modal in the middle of the board when the player / opponent is in check.
 * 
 * @param {string} whoIsInCheck A string containing whoever is in check.
 */
export const checkModal = (whoIsInCheck: string) => {
   let modal: HTMLElement | null = document.querySelector(`.${whoIsInCheck}`);
    if(modal){
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout( () => {
            if(modal){
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, whoIsInCheck === `player-checkmate-modal` || whoIsInCheck === `AI-checkmate-modal` ? 4000 : 1200);
    }
}

/**
 * Inserts a game log into the HTML for when the Player/AI moves/captures.
 * 
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 * 
 */
export const insertGameLog = (isAI: boolean, startCell: Cell | null, endCell: Cell | null, game: Game) => {
    if(startCell !== null && endCell !== null){
        let startX = startCell.getX();
        let startY = startCell.getY();
        let endX = endCell.getX();
        let endY = endCell.getY();
    
        let gamePosition = game.getCorrespondingPosition();
    
        let isCapture = endCell.getPiece() !== null;
    
        let container: HTMLElement | null = document.querySelector(`.game-log`);
        if(container){
            let endPiece = endCell.getPiece();
            let startPiece = startCell.getPiece();
            if(isAI && startPiece !== null){
                if(isCapture && endPiece !== null){
                    container.insertAdjacentHTML("beforeend", `<div class='log ai-log'><span class='ai-name'>AI</span> captured your ${endPiece.getType()} (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]})</div>`);
                }else{
                    container.insertAdjacentHTML("beforeend",  `<div class='log ai-log'><span class='ai-name'>AI</span> moved its ${startPiece.getType()} (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]})</div>`);
                }
            }
            else if(startPiece !== null){
                if(isCapture && endPiece !== null){
                    container.insertAdjacentHTML("beforeend", `<div class='log player-log'> <span class='player-name'>You</span> captured AI's ${endPiece.getType()} (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]})</div>`);
                }else{
                    container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> moved your ${startPiece.getType()} (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]})</div>`);
                }
            }
            container.scrollTop = container.scrollHeight;
        }
    }
}

/**
 *  Removes the existing game log if 'New Game' is clicked.
 * 
 */
export const removeGameLog = ()=> {
    let container: HTMLElement | null = document.querySelector(`.game-log`);
    if(container !== null){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }
}

/**
 * Inserts a game log into the HTML for when the Player/AI is in Check/Checkmate/Stalemate.
 * 
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isInCheck True if the Player/AI is in Check, False o/w.
 * @param {boolean} isInCheckmate True if the Player/AI is in Checkmate, False o/w.
 * @param {boolean} isInStalemate True if the Player/AI is in Stalemate, False o/w.
 * 
 */
export const insertSpecialLog = (isAI: boolean, isInCheck: boolean, isInCheckmate: boolean, isInStalemate: boolean) => {
    let container: HTMLElement | null = document.querySelector(`.game-log`);
    if(container !== null){
        if(isAI){
            if(isInCheckmate){
                container.insertAdjacentHTML("beforeend", `<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Checkmate </div>`);
            }else if(isInCheck){
                container.insertAdjacentHTML("beforeend", `<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Check </div>`);
            }else if(isInStalemate){
                container.insertAdjacentHTML("beforeend", `<div class='log'> Game is in Stalemate </div>`);
            }
        }else{
            if(isInCheckmate){
                container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> placed AI in Checkmate </div>`);
            }else if(isInCheck){
                container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> placed AI in Check </div>`);
            }else if(isInStalemate){
                container.insertAdjacentHTML("beforeend",  `<div class='log'> Game is in Stalemate </div>`);
            }
        }
        container.scrollTop = container.scrollHeight;
    }
}


/**
 * Inserts a game log into the HTML for when the Player/AI has made a castling move.
 * 
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isKingside True if the Player/AI made a Kingside castle, False if the Player/AI made a Queenside castle.
 * 
 */
export const insertCastlingLog = (isAI: boolean, isKingside: boolean) => {

    let container: HTMLElement | null = document.querySelector(`.game-log`);
    if(container !== null){
        if(isAI){
            if(isKingside){
                container.insertAdjacentHTML("beforeend", `<div class='log ai-log'><span class='ai-name'>AI</span> performed Kingside Castling </div>`);
            }
            else{
                container.insertAdjacentHTML("beforeend", `<div class='log ai-log'><span class='ai-name'>AI</span> performed Queenside Castling </div>`);
            }
        }else{
            if(isKingside){
                container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> performed Kingside Castling </div>`);
            }
            else{
                container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> performed Queenside Castling </div>`);
            }
        }
        container.scrollTop = container.scrollHeight;
    }
}

/**
 * Inserts a game log into the HTML for when the Player/AI makes an en passant move.
 * 
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 * 
 */
export const isEnPassantLog = (isAI: boolean, startCell: Cell | null, endCell: Cell | null, game: Game) => {

    if(startCell !== null && endCell !== null){

        let startX = startCell.getX();
        let startY = startCell.getY();
        let endX = endCell.getX();
        let endY = endCell.getY();
    
        let gamePosition = game.getCorrespondingPosition();
    
        let container: HTMLElement | null = document.querySelector(`.game-log`);
        if(container !== null){
            if(isAI){
                container.insertAdjacentHTML("beforeend", `<div class='log ai-log'><span class='ai-name'>AI</span> made En passant capture (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]}) </div>`);
            }else{
                container.insertAdjacentHTML("beforeend", ` <div class='log player-log'> <span class='player-name'>You</span> made En passant capture (${gamePosition[startX][startY]}, ${gamePosition[endX][endY]}) </div>`);
            }
            container.scrollTop = container.scrollHeight;
        }
    }
}


/**
 * Inserts a modal into the HTML for when the player/AI is in Stalemate.
 * 
 */
export const stalemateModal = () => {
    let modal: HTMLElement | null = document.querySelector(`.stalemate-modal`);
    if(modal){
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout( () => {
            if(modal){
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, 3000);
    }

}

/**
 * Disables a button on the Screen (except Level).
 * 
 * @param {string} button The CSS class for the button that need to be disabled.
 * 
 */
export const disableButtonView = (button: string) =>{
    const btn = document.querySelector(`.${button}`) as HTMLElement;
    btn.classList.add(`disable-btn`);
}

/**
 * Disables the level button on the Screen.
 * 
 * @param {string} button The CSS class for the disable button class.
 * 
 */
export const disableLevelButton = (button: string) => {
    const disableBtn = document.querySelector(`#${button}`) as HTMLElement;
    const btn = document.querySelectorAll(`#select-level .level-dropdown`);
    disableBtn.classList.add(`disable-btn`);
    btn.forEach(e => {
       let element = e as HTMLElement;
        element.style.color = '#c9c9c9';
        element.style.borderColor = '#c9c9c9';
    })
}

/**
 * Enables the level button on the Screen.
 * 
 * @param {string} button The CSS class for the disable button class.
 * 
 */
export const enableLevelButton = (button: string) => {
    const disableBtn = document.querySelector(`#${button}`) as HTMLElement;
    const btn = document.querySelectorAll(`#select-level .level-dropdown`);
    disableBtn.classList.remove(`disable-btn`);
    btn.forEach(e => {
       let element = e as HTMLElement;
        element.style.removeProperty('color');
        element.style.removeProperty('border-color');
    })
}

/**
 * Removes the possiblity to click the board and buttons (except New Game) when the game is in Checkmate/Stalemate.
 * 
 */
export const checkmateStalemateEnable = () =>{
    let cells = document.querySelectorAll(`.cell`);
    cells.forEach( cell => {
        let htmlCellElement = <HTMLElement>cell;
        htmlCellElement.style.setProperty(`pointer-events`, `none`);
        for(let count=0; count<12; count++){
            if(cell.children[count] !== null){
                let piece = cell.children[count];
                let htmlPieceElement = <HTMLElement>piece;
                if(piece !== undefined){
                    htmlPieceElement.style.setProperty(`filter`, `invert(41%) sepia(64%) saturate(0%) hue-rotate(185deg) brightness(97%) contrast(93%)`);
                }
            }
        }
    })

    let cellsDark = document.querySelectorAll(`.chess-dark`);
    cellsDark.forEach( cell => {
        let htmlCellElement = <HTMLElement>cell;
        htmlCellElement.style.setProperty(`background-color`,`lightgray`);
    })

    let board = document.querySelector(`.board`) as HTMLElement;
    board.style.setProperty(`border`, `12px solid rgba(169,169,169, 0.7)`);

    const switchColorBtn = document.querySelector(`.switchColor`) as HTMLElement;
    switchColorBtn.classList.add(`disable-btn`);

    const resignBtn = document.querySelector(`.resign`) as HTMLElement;
    resignBtn.classList.add(`disable-btn`);
}

/**
 * Enables the possiblity to click the board and buttons.
 * 
 */
export const checkmateDisable = () =>{
    let cells = document.querySelectorAll(`.cell`);
    cells.forEach( cell => {
        let htmlCellElement = <HTMLElement>cell;
        htmlCellElement.style.removeProperty(`pointer-events`);
        for(let count=0; count<12; count++){
            if(cell.children[count] !== null){
                let piece = cell.children[count];
                let htmlPieceElement = <HTMLElement>piece;
                if(piece !== undefined){
                    htmlPieceElement.style.removeProperty(`filter`);
                }
            }
        }
    })

    let cellsDark = document.querySelectorAll(`.chess-dark`);
    cellsDark.forEach( cell => {
        let htmlCellElement = <HTMLElement>cell;
        htmlCellElement.style.removeProperty(`background-color`);
    })

    let board = document.querySelector(`.board`) as HTMLElement;
    board.style[`border`] = `12px solid #a09af160`

    const switchColorBtn = document.querySelector(`.switchColor`) as HTMLElement;
    switchColorBtn.classList.remove(`disable-btn`);

    const resignBtn = document.querySelector(`.resign`) as HTMLElement;
    resignBtn.classList.remove(`disable-btn`);
}



/**
 * IN PROGRESS.
 * Sets up a move animation when the Player/AI makes a move.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {boolean} isWhite True if the Piece is white, false o/w.
 */
export const moveAnimation = (startCell: Cell, endCell: Cell, isWhite: boolean) => {
    let startPiece = startCell.getPiece();
    let color: string = isWhite === true ? 'W' : 'B';
    let targetHTML: string = `<img class="chess-piece" src="./css/assets/${startPiece}${color}.svg" alt="${startPiece}" data-ispiecewhite=${isWhite}>`;
}
