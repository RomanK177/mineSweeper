'use strict';

const MINE = '&#9760'
const MARK = '&#9873'

var gBoard;
var gGameInterval;
var gIsGameOn = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    size: 4,
    mines: 2
}

function initGame() {
    gBoard = buildBoard();
    //Step1 - Place 2 mines
    // gBoard[1][1].isMine = true
    // gBoard[2][2].isMine = true
    randomMines()
        //Recheck if needed here:
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gIsGameOn = true;
    if (gGameInterval) clearInterval(gGameInterval)
        // gGameInterval = setInterval(ADD TIMER FUNCTION);

    document.querySelector("table").addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);

}

function buildBoard() {
    //According dificulty
    var boardSize = gLevel.size

    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = {
                minesAroundCount: undefined,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = row[j];
            var className = ''
            className = (cell.isShown) ? className += 'shown' : className += 'hidden';
            // console.log(className)
            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" 
                            oncontextmenu="cellMarked(this, ${i}, ${j})"
                            data-i="${i}" 
                            data-j="${j}" 
                            class="${className}">`;

            if (cell.isMine && cell.isShown) {
                strHTML += MINE
            } else if (cell.isShown) {
                strHTML = (cell.minesAroundCount === 0) ? strHTML += '' : strHTML += cell.minesAroundCount;
            } else if (cell.isMarked) {
                strHTML += MARK
            }
            strHTML += '</td>';
        }
        strHTML += '</tr>';
        // console.log(strHTML)
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) { //the matrix is symmetrical
            gBoard[i][j].minesAroundCount = countMines(i, j, board)
        }
    }

}


function countMines(cellI, cellJ, mat) {
    var minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine === true) minesAroundCount++;
        }
    }
    return minesAroundCount;
}

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isMarked) return;
    gBoard[i][j].isShown = true
    if (gBoard[i][j].minesAroundCount === 0) revealNegs(i, j, gBoard)
    renderBoard(gBoard)

}

function cellMarked(elCell, i, j) {
    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true;
    renderBoard(gBoard)
}

function randomMines() {
    for (var i = 1; i <= gLevel.mines; i++) {
        var row = getRandomIntInclusive(0, gLevel.size - 1)
        var col = getRandomIntInclusive(0, gLevel.size - 1)
        gBoard[row][col].isMine = true
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function revealNegs(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            mat[i][j].isShown = true
                // if (mat[i][j].minesAroundCount === 0 && mat[i][j].isShown === false) revealNegs(i, j, mat);
        }
    }
}