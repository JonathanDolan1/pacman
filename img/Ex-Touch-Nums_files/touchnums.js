'use strict'

var gBoardSize
var gNums
var gNextNum
var gMilliseconds
var gSeconds
var gMinutes
var gStartTime
var gTimerIntervalId
var gSelectedDifficulty = null
var gModalIntervalId = null

function onInit() {

}

function onNewGame() {
    if (!gSelectedDifficulty) {
        openSelectDifficultyModal()
    } else {
        defineBoardSize()
        resetGameVars()
        hideVictory()
        renderDisplay()
        renderBoard()
        unmarkDifficultyCells()
    }
}

function unmarkDifficultyCells() {
    var elCells = document.querySelectorAll('.levels td')
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.remove('mark')
    }
    gSelectedDifficulty = null
}

function defineBoardSize() {
    if (gSelectedDifficulty === 'Easy') {
        gBoardSize = 4
    } else if (gSelectedDifficulty === 'Hard') {
        gBoardSize = 5
    } else if (gSelectedDifficulty === 'Extreme') {
        gBoardSize = 6
    }
}

function resetGameVars() {
    clearInterval(gTimerIntervalId)
    gNextNum = 1
    gMilliseconds = 0
    gSeconds = 0
    gMinutes = 0
    resetNums()
}

function openSelectDifficultyModal() {
    var elH3 = document.querySelector('h3')
    elH3.style.visibility = 'visible'
    clearInterval(gModalIntervalId)
    gModalIntervalId = setTimeout(() => elH3.style.visibility = 'hidden', 3000)
}

function hideVictory() {
    var elH2 = document.querySelector('h2')
    elH2.style.visibility = 'hidden'
}

function onChooseDifficulty(elCell) {
    unmarkDifficultyCells()
    elCell.classList.add('mark')
    gSelectedDifficulty = elCell.innerText
    elCell.data.size
}

function onCheckNum(elCell, num) {
    if (num === gNextNum) {
        if (num === 1) {
            // gTimerIntervalId = setInterval(renderTimer, 1)
            startTimer()
        }
        elCell.classList.add('done')
        gNextNum++
        checkVictory(num)
    }
}

function checkVictory(num) {
    if (num === gBoardSize ** 2) {
        var elH2 = document.querySelector('h2')
        elH2.style.visibility = 'visible'
        clearInterval(gTimerIntervalId)
    } else renderNextNum()
}

// function renderTimer() {
//     var elDivTimer = document.querySelector('.timer')
//     var msZeroStr
//     if (gMilliseconds > 99) {
//         msZeroStr = ''
//     } else if (gMilliseconds > 9) {
//         msZeroStr = '0'
//     } else msZeroStr = '00'
//     var secondsZeroStr = (gSeconds > 9) ? '' : '0'
//     var minutesZeroStr = (gMinutes > 9) ? '' : '0'
//     elDivTimer.innerText = `Timer: ${minutesZeroStr}${gMinutes}:${secondsZeroStr}${gSeconds}:${msZeroStr}${gMilliseconds}`
//     gMilliseconds++
//     if (gMilliseconds === 1000) {
//         gSeconds++
//         gMilliseconds = 0
//         if (gSeconds === 60) {
//             gMinutes++
//             gSeconds = 0
//         }
//     }
// }

function renderNextNum() {
    var elDivNextNum = document.querySelector('.next-num')
    elDivNextNum.innerText = `Next Num: ${gNextNum}`
}

function renderDisplay() {
    var elDivDisplay = document.querySelector('.display')
    elDivDisplay.innerHTML = `<div class="next-num">Next Num: 1</div>
    <div class="timer">Timer: <span>0.00<span></div>`
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoardSize; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoardSize; j++) {
            var randNum = gNums.splice(getRandomInt(0, gNums.length), 1)
            strHTML += `<td onclick="onCheckNum(this,${randNum})">${randNum}</td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function resetNums() {
    gNums = []
    for (var i = 0; i < gBoardSize ** 2; i++) {
        gNums.push(i + 1)
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function startTimer() {

    gStartTime = Date.now()

    gTimerIntervalId = setInterval(() => {
        // var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2);
        var seconds = ((Date.now() - gStartTime));
        var elSpan = document.querySelector('.timer span');
        elSpan.innerText = seconds
    }, 10);
}