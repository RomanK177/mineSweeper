function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateTimer() {
    var time = ((Date.now() - gStartTime).toFixed(0)) / 1000
    gGame.secsPassed = time.toFixed(0)
    document.querySelector(".timer").innerText = 'Time: ' + gGame.secsPassed + " Sec"
}

function refillHints() {
    var hints = document.querySelectorAll(".hint")
    for (var i = 0; i < hints.length; i++) {
        hints[i].innerText = HINT
    }
}

function hint(elHint) {
    if (elHint.classList.contains("on")) return
    gGame.isHintOn = true
    elHint.classList.add("on")
}

function revealHint(cellI, cellJ, mat, elCell) {
    var shownHintCells = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            // if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isShown === true) continue;
            shownHintCells.push(mat[i][j])
            mat[i][j].isShown = true


        }
    }
    renderBoard(gBoard)
    setTimeout(function() {
        for (var i = 0; i < shownHintCells.length; i++) {
            shownHintCells[i].isShown = false

        }
        renderBoard(gBoard)
        shownHintCells = []
    }, 1000)
    gGame.isHintOn = false
    var cellHint = document.querySelector(".on")
    cellHint.classList.remove("on")
    cellHint.innerText = ""
}