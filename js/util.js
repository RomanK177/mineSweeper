// function copyMat(mat) {
//     var newMat = [];
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = [];
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j];
//         }
//     }
//     return newMat;
// }

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