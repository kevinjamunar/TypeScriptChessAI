"use strict";
exports.__esModule = true;
/**
 * Highlights the HTML piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addPieceHighlight = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.add("apply-cell-click");
            cell.children[count].classList.remove("apply-wrong-cell");
        }
    }
};
/**
 * Removes the highlight for the HTML piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.removePieceHighlight = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.remove("apply-cell-click");
        }
    }
};
/**
 * Adds the red shake CSS class on the piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addWrongCellAnimation = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.add("apply-wrong-cell");
        }
        cell.classList.add("apply-wrong-cell-background");
        setTimeout(function () {
            cell.classList.remove("apply-wrong-cell-background");
        }, 600);
    }
};
/**
 * Removes the red shake CSS class on the piece containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.removeWrongCellAnimation = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        for (var count = 0; count < 12; count++) {
            cell.children[count].classList.remove("apply-wrong-cell");
        }
        cell.classList.add("apply-wrong-cell-background");
        setTimeout(function () {
            cell.classList.remove("apply-wrong-cell-background");
        }, 600);
    }
};
/**
 * Adds the blue background on the cell containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addMovingCellAnimationCapture = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        cell.classList.add("apply-moving-cell-background-capture");
        setTimeout(function () {
            cell.classList.remove("apply-moving-cell-background-capture");
        }, 500);
    }
};
/**
 * Adds the green background on the cell containing the CSS class, cellID
 *
 * @param {string} cellID The cell with CSS class, cellID.
 */
exports.addMovingCellAnimationNoCapture = function (cellID) {
    var cell = document.querySelector(".cell-" + cellID);
    if (cell) {
        cell.classList.add("apply-moving-cell-background-nocapture");
        setTimeout(function () {
            cell.classList.remove("apply-moving-cell-background-nocapture");
        }, 500);
    }
};
/**
 * Inserts a quote string into the HTML
 *
 * @param {string} quote The quote to insert into the HTML.
 */
exports.setQuote = function (quote) {
    var targetHTML = "<div class='quote'> " + quote + " </div>";
    var nav = document.querySelector('nav');
    if (nav) {
        var prevQuote = document.querySelector('.quote');
        if (prevQuote) {
            prevQuote.remove();
        }
        nav.insertAdjacentHTML('afterend', targetHTML);
    }
};
/**
 * Inserts a piece by setting the specified image display to inline.
 *
 * @param {string} cellNumber The cell location to insert the image.
 * @param {string} piece The piece to insert.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
exports.insertPiecePlayerFast = function (cellNumber, piece, isWhite) {
    var color = isWhite === true ? 'W' : 'B';
    var targetImg = document.querySelector("." + piece + color + "Img" + cellNumber);
    if (targetImg) {
        targetImg.style.display = 'inline';
    }
};
/**
 * Removes a piece by setting the specified image display to none.
 *
 * @param {string} cellNumber The cell location to remove the image.
 * @param {string} piece The piece to remove.
 * @param {boolean} isWhite True if the piece is white, False otherwise.
 */
exports.removePiecePlayerFast = function (cellNumber, piece, isWhite) {
    var color = isWhite === true ? 'W' : 'B';
    var targetImg = document.querySelector("." + piece + color + "Img" + cellNumber);
    if (targetImg) {
        targetImg.style.display = 'none;';
        targetImg.classList.remove('apply-wrong-cell');
    }
};
/**
 * Removes all pieces on the specified cell, cellNumber
 *
 * @param {string} cellNumber The cell location to insert the cell piece.
 */
exports.removeAllPiecePlayerFast = function (cellNumber) {
    var img0 = document.querySelector(".PawnWImg" + cellNumber);
    var img1 = document.querySelector(".PawnBImg" + cellNumber);
    var img2 = document.querySelector(".RookWImg" + cellNumber);
    var img3 = document.querySelector(".RookBImg" + cellNumber);
    var img4 = document.querySelector(".KnightWImg" + cellNumber);
    var img5 = document.querySelector(".KnightBImg" + cellNumber);
    var img6 = document.querySelector(".BishopWImg" + cellNumber);
    var img7 = document.querySelector(".BishopBImg" + cellNumber);
    var img8 = document.querySelector(".QueenWImg" + cellNumber);
    var img9 = document.querySelector(".QueenBImg" + cellNumber);
    var img10 = document.querySelector(".KingWImg" + cellNumber);
    var img11 = document.querySelector(".KingBImg" + cellNumber);
    if (img0 && img1 && img2 && img3 && img4 && img5 && img6 && img7 && img8 && img9 && img10 && img11) {
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
        img0.classList.remove("apply-wrong-cell");
        img1.classList.remove("apply-wrong-cell");
        img2.classList.remove("apply-wrong-cell");
        img3.classList.remove("apply-wrong-cell");
        img4.classList.remove("apply-wrong-cell");
        img5.classList.remove("apply-wrong-cell");
        img6.classList.remove("apply-wrong-cell");
        img7.classList.remove("apply-wrong-cell");
        img8.classList.remove("apply-wrong-cell");
        img9.classList.remove("apply-wrong-cell");
        img10.classList.remove("apply-wrong-cell");
        img11.classList.remove("apply-wrong-cell");
    }
};
/**
 * Inserts all images into the HTML for faster loading when moving pieces.
 */
exports.insertImagesForFastLoading = function () {
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            var targetCell = document.querySelector(".cell-" + row + col);
            if (targetCell) {
                targetCell.insertAdjacentHTML("afterbegin", "<!-- Images For Loading Quickly Start -->\n                <img class=\"chess-piece pawnWImg" + row + col + " PawnWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/PawnW.svg\" alt=\"Pawn\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece pawnBImg" + row + col + " PawnBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/PawnB.svg\" alt=\"Pawn\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece queenWImg" + row + col + " QueenWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/QueenW.svg\" alt=\"Queen\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece queenBImg" + row + col + " QueenBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/QueenB.svg\" alt=\"Queen\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece kingWImg" + row + col + " KingWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KingW.svg\" alt=\"King\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece kingBImg" + row + col + " KingBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KingB.svg\" alt=\"King\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece bishopWImg" + row + col + " BishopWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/BishopW.svg\" alt=\"Bishop\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece bishopBImg" + row + col + " BishopBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/BishopB.svg\" alt=\"Bishop\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece kingWImg" + row + col + " KnightWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KnightW.svg\" alt=\"Knight\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece kingBImg" + row + col + " KnightBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/KnightB.svg\" alt=\"Knight\" data-ispiecewhite=\"false\">\n                <img class=\"chess-piece rookWImg" + row + col + " RookWImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/RookW.svg\" alt=\"Rook\" data-ispiecewhite=\"true\">\n                <img class=\"chess-piece rookBImg" + row + col + " RookBImg" + row + col + "\" style=\"display: none;\" src=\"./css/assets/RookB.svg\" alt=\"Rook\" data-ispiecewhite=\"false\">\n                <!-- Images For Loading Quickly End -->");
            }
        }
    }
};
/**
 * Removes a piece represented by an HTML Element on the board
 *
 * @param {Number} cellNumber The cell location to insert the cell piece.
 */
exports.removePiece = function (cellNumber) {
    var targetCell = document.querySelector(".cell-" + cellNumber);
    if (targetCell && targetCell.firstChild) {
        targetCell.removeChild(targetCell.firstChild);
    }
};
/**
 * Displays a modal in the middle of the board when the player / opponent is in check.
 *
 * @param {string} whoIsInCheck A string containing whoever is in check.
 */
exports.checkModal = function (whoIsInCheck) {
    var modal = document.querySelector("." + whoIsInCheck);
    if (modal) {
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout(function () {
            if (modal) {
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, whoIsInCheck === "player-checkmate-modal" || whoIsInCheck === "AI-checkmate-modal" ? 4000 : 1200);
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI moves/captures.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 *
 */
exports.insertGameLog = function (isAI, startCell, endCell, game) {
    if (startCell !== null && endCell !== null) {
        var startX = startCell.getX();
        var startY = startCell.getY();
        var endX = endCell.getX();
        var endY = endCell.getY();
        var gamePosition = game.getCorrespondingPosition();
        var isCapture = endCell.getPiece() !== null;
        var container = document.querySelector(".game-log");
        if (container) {
            var endPiece = endCell.getPiece();
            var startPiece = startCell.getPiece();
            if (isAI && startPiece !== null) {
                if (isCapture && endPiece !== null) {
                    container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> captured your " + endPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
                else {
                    container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> moved its " + startPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
            }
            else if (startPiece !== null) {
                if (isCapture && endPiece !== null) {
                    container.insertAdjacentHTML("beforeend", "<div class='log player-log'> <span class='player-name'>You</span> captured AI's " + endPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
                else {
                    container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> moved your " + startPiece.getType() + " (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ")</div>");
                }
            }
            container.scrollTop = container.scrollHeight;
        }
    }
};
/**
 *  Removes the existing game log if 'New Game' is clicked.
 *
 */
exports.removeGameLog = function () {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI is in Check/Checkmate/Stalemate.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isInCheck True if the Player/AI is in Check, False o/w.
 * @param {boolean} isInCheckmate True if the Player/AI is in Checkmate, False o/w.
 * @param {boolean} isInStalemate True if the Player/AI is in Stalemate, False o/w.
 *
 */
exports.insertSpecialLog = function (isAI, isInCheck, isInCheckmate, isInStalemate) {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        if (isAI) {
            if (isInCheckmate) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Checkmate </div>");
            }
            else if (isInCheck) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'> <span class='ai-name'>AI</span> placed you in Check </div>");
            }
            else if (isInStalemate) {
                container.insertAdjacentHTML("beforeend", "<div class='log'> Game is in Stalemate </div>");
            }
        }
        else {
            if (isInCheckmate) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> placed AI in Checkmate </div>");
            }
            else if (isInCheck) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> placed AI in Check </div>");
            }
            else if (isInStalemate) {
                container.insertAdjacentHTML("beforeend", "<div class='log'> Game is in Stalemate </div>");
            }
        }
        container.scrollTop = container.scrollHeight;
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI has made a castling move.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {boolean} isKingside True if the Player/AI made a Kingside castle, False if the Player/AI made a Queenside castle.
 *
 */
exports.insertCastlingLog = function (isAI, isKingside) {
    var container = document.querySelector(".game-log");
    if (container !== null) {
        if (isAI) {
            if (isKingside) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> performed Kingside Castling </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> performed Queenside Castling </div>");
            }
        }
        else {
            if (isKingside) {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> performed Kingside Castling </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> performed Queenside Castling </div>");
            }
        }
        container.scrollTop = container.scrollHeight;
    }
};
/**
 * Inserts a game log into the HTML for when the Player/AI makes an en passant move.
 *
 * @param {boolean} isAI True if the AI moved, False if the player moved.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {Game} game The current game that is being played.
 *
 */
exports.isEnPassantLog = function (isAI, startCell, endCell, game) {
    if (startCell !== null && endCell !== null) {
        var startX = startCell.getX();
        var startY = startCell.getY();
        var endX = endCell.getX();
        var endY = endCell.getY();
        var gamePosition = game.getCorrespondingPosition();
        var container = document.querySelector(".game-log");
        if (container !== null) {
            if (isAI) {
                container.insertAdjacentHTML("beforeend", "<div class='log ai-log'><span class='ai-name'>AI</span> made En passant capture (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ") </div>");
            }
            else {
                container.insertAdjacentHTML("beforeend", " <div class='log player-log'> <span class='player-name'>You</span> made En passant capture (" + gamePosition[startX][startY] + ", " + gamePosition[endX][endY] + ") </div>");
            }
            container.scrollTop = container.scrollHeight;
        }
    }
};
/**
 * Inserts a modal into the HTML for when the player/AI is in Stalemate.
 *
 */
exports.stalemateModal = function () {
    var modal = document.querySelector(".stalemate-modal");
    if (modal) {
        modal.style.width = "280px";
        modal.style.height = "120px";
        modal.style.opacity = "1";
        setTimeout(function () {
            if (modal) {
                modal.style.width = "0";
                modal.style.height = "0";
                modal.style.opacity = "0";
            }
        }, 3000);
    }
};
/**
 * Disables a button on the Screen (except Level).
 *
 * @param {string} button The CSS class for the button that need to be disabled.
 *
 */
exports.disableButtonView = function (button) {
    var btn = document.querySelector("." + button);
    btn.classList.add("disable-btn");
};
/**
 * Disables the level button on the Screen.
 *
 * @param {string} button The CSS class for the disable button class.
 *
 */
exports.disableLevelButton = function (button) {
    var disableBtn = document.querySelector("#" + button);
    var btn = document.querySelectorAll("#select-level .level-dropdown");
    disableBtn.classList.add("disable-btn");
    btn.forEach(function (e) {
        var element = e;
        element.style.color = '#c9c9c9';
        element.style.borderColor = '#c9c9c9';
    });
};
/**
 * Enables the level button on the Screen.
 *
 * @param {string} button The CSS class for the disable button class.
 *
 */
exports.enableLevelButton = function (button) {
    var disableBtn = document.querySelector("#" + button);
    var btn = document.querySelectorAll("#select-level .level-dropdown");
    disableBtn.classList.remove("disable-btn");
    btn.forEach(function (e) {
        var element = e;
        element.style.removeProperty('color');
        element.style.removeProperty('border-color');
    });
};
/**
 * Removes the possiblity to click the board and buttons (except New Game) when the game is in Checkmate/Stalemate.
 *
 */
exports.checkmateStalemateEnable = function () {
    var cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.setProperty("pointer-events", "none");
        for (var count = 0; count < 12; count++) {
            if (cell.children[count] !== null) {
                var piece = cell.children[count];
                var htmlPieceElement = piece;
                if (piece !== undefined) {
                    htmlPieceElement.style.setProperty("filter", "invert(41%) sepia(64%) saturate(0%) hue-rotate(185deg) brightness(97%) contrast(93%)");
                }
            }
        }
    });
    var cellsDark = document.querySelectorAll(".chess-dark");
    cellsDark.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.setProperty("background-color", "lightgray");
    });
    var board = document.querySelector(".board");
    board.style.setProperty("border", "12px solid rgba(169,169,169, 0.7)");
    var switchColorBtn = document.querySelector(".switchColor");
    switchColorBtn.classList.add("disable-btn");
    var resignBtn = document.querySelector(".resign");
    resignBtn.classList.add("disable-btn");
};
/**
 * Enables the possiblity to click the board and buttons.
 *
 */
exports.checkmateDisable = function () {
    var cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.removeProperty("pointer-events");
        for (var count = 0; count < 12; count++) {
            if (cell.children[count] !== null) {
                var piece = cell.children[count];
                var htmlPieceElement = piece;
                if (piece !== undefined) {
                    htmlPieceElement.style.removeProperty("filter");
                }
            }
        }
    });
    var cellsDark = document.querySelectorAll(".chess-dark");
    cellsDark.forEach(function (cell) {
        var htmlCellElement = cell;
        htmlCellElement.style.removeProperty("background-color");
    });
    var board = document.querySelector(".board");
    board.style["border"] = "12px solid #a09af160";
    var switchColorBtn = document.querySelector(".switchColor");
    switchColorBtn.classList.remove("disable-btn");
    var resignBtn = document.querySelector(".resign");
    resignBtn.classList.remove("disable-btn");
};
/**
 * IN PROGRESS.
 * Sets up a move animation when the Player/AI makes a move.
 * @param {Cell | null} startCell The start cell of the piece that was moved.
 * @param {Cell | null} endCell The end cell of the piece that was moved.
 * @param {boolean} isWhite True if the Piece is white, false o/w.
 */
exports.moveAnimation = function (startCell, endCell, isWhite) {
    var startPiece = startCell.getPiece();
    var color = isWhite === true ? 'W' : 'B';
    var targetHTML = "<img class=\"chess-piece\" src=\"./css/assets/" + startPiece + color + ".svg\" alt=\"" + startPiece + "\" data-ispiecewhite=" + isWhite + ">";
};
