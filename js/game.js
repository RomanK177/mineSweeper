'use strict';

const MARK = '&#9873'
const NORMAL = '😀'
const DEAD = '🤯'
const WON = '🤩'
const HINT = '💡'
const MINE_IMG = '<img src="img/images.jfif" style="height: 15px;" />';

var gStartTime;
var gBoard;
var gBestScore = Infinity

var gGameInterval;

var gGame = {}
var gLevel = {
    size: 4,
    mines: 2
}

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard)
    if (gGameInterval) clearInterval(gGameInterval)
    document.querySelector("table").addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        areThereMines: false,
        isHintOn: false
    }
    document.querySelector(".marked").innerHTML = 'Mines Left: ' + (gLevel.mines - gGame.markedCount)
    document.querySelector(".timer").innerText = 'Time: '
    document.querySelector(".lives").innerText = 'Lives: ' + gGame.lives
    document.querySelector(".status").innerText = NORMAL
    refillHints()
    document.querySelector(".game-over").style.display = "none"
    document.querySelector(".game-won").style.display = "none"

}

function buildBoard() {
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
            strHTML += getCellInnerHtml(i, j)
        }
        strHTML += '</tr>';
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHTML;
}

function getCellInnerHtml(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    var className = ''
    var strHTML = ''
    className = (cell.isShown) ? className += 'shown' : className += 'hidden';
    strHTML += `<td onclick="cellClicked(this, ${cellI}, ${cellJ})" 
                            oncontextmenu="cellMarked(this, ${cellI}, ${cellJ})"
                            class="${className}">`;

    if (cell.isMine && cell.isShown) {
        strHTML += MINE_IMG
    } else if (cell.isShown) {
        strHTML = (cell.minesAroundCount === 0) ? strHTML += '' : strHTML += cell.minesAroundCount;
    } else if (cell.isMarked) {
        strHTML += MARK
    }
    strHTML += '</td>';
    return strHTML
}

function renderCell(elCell, cellI, cellJ) {
    elCell.innerHTML = getCellInnerHtml(cellI, cellJ)
    if (gBoard[cellI][cellJ].isShown) {
        elCell.classList.remove("hidden")
        elCell.classList.add("shown")
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
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

function cellClicked(elCell, cellI, cellJ) {
    if (!gGame.areThereMines) {
        placeRandomMines(cellI, cellJ, gBoard)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
        gStartTime = Date.now()
        gGameInterval = setInterval(updateTimer, 100)
    }
    if (!gGame.isOn) return
    if (gGame.isHintOn) {
        revealHint(cellI, cellJ, gBoard, elCell)
        setTimeout(function() {

        })
    }
    if (gBoard[cellI][cellJ].isMarked) return;
    if (gBoard[cellI][cellJ].isShown) return;
    if (gBoard[cellI][cellJ].isMine) {
        gGame.lives--;
        checkGameOver(cellI, cellJ)
        return
    }
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
        if (gBoard[cellI][cellJ].minesAroundCount === 0) revealNegs(cellI, cellJ, gBoard, elCell)
    checkGameWon()
    renderCell(elCell, cellI, cellJ)
}


function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    }
    renderCell(elCell, i, j)
    document.querySelector(".marked").innerHTML = 'Mines Left: ' + (gLevel.mines - gGame.markedCount)
    checkGameWon()
}

function placeRandomMines(cellI, cellJ) {
    var minesCount = 0
    var cellCoor = '' + cellI + cellJ
    while (minesCount < gLevel.mines) {
        var mineRow = getRandomIntInclusive(0, gLevel.size - 1)
        var mineCel = getRandomIntInclusive(0, gLevel.size - 1)
        var mineCoor = '' + mineRow + mineCel
        if (cellCoor != mineCoor && gBoard[mineRow][mineCel].isMine === !true) {
            gBoard[mineRow][mineCel].isMine = true
            minesCount++
        }
    }
    gGame.areThereMines = true
}



function revealNegs(cellI, cellJ, mat, elCell) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine === true) continue;
            if (mat[i][j].isShown === true) continue;
            mat[i][j].isShown = true
            gGame.shownCount++
                renderBoard(gBoard)
                // renderCell(elCell, cellI, cellJ)
            if (mat[i][j].minesAroundCount === 0 && !gGame.isHintOn) revealNegs(i, j, mat, elCell);
        }
    }
}

function checkGameOver(cellI, cellJ) {
    if (gBoard[cellI][cellJ].isMine === true) {
        document.querySelector(".lives").innerText = 'Lives: ' + gGame.lives
        if (gGame.lives === 0) gameOver()
    } else return false
}

function checkGameWon() {
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === (Math.pow(gLevel.size, 2) - gLevel.mines)) {
        gameWon()
    }

}

function gameOver() {
    gGame.isOn = false
    clearInterval(gGameInterval)
    for (var i = 0; i < gLevel.size; i++) {
        var row = gBoard[i]
        for (var j = 0; j < gLevel.size; j++) {
            var cell = row[j]
            if (cell.isMine) cell.isShown = true
        }
    }
    renderBoard(gBoard)
    document.querySelector(".game-over").style.display = "block"
    document.querySelector(".status").innerText = DEAD
}

function gameWon() {
    gGame.isOn = false
        // if (gBestScore > gGameInterval) {
        //     localStorage.setItem(gLevel.difficulty, gGameInterval)
        //     gBestScore = gGameInterval
        // }
    clearInterval(gGameInterval)
    document.querySelector(".game-won").style.display = "block"
    document.querySelector(".status").innerText = WON
        // document.querySelector(".best-score").innerText = `Best Score: ${localStorage.getItem(gLevel.difficulty)}`

}

function setBeginer() {
    gLevel.difficulty = "beginer"
    gLevel.size = 4;
    gLevel.mines = 2;
    initGame()
}

function setMedium() {
    gLevel.difficulty = "medium"
    gLevel.size = 8;
    gLevel.mines = 12;
    initGame()
}

function setExpert() {
    gLevel.difficulty = "expert"
    gLevel.size = 12;
    gLevel.mines = 30;
    initGame()
}