'use strict'

const WALL = '⬛️'
const FOOD = '·'
const SUPER_FOOD = '⏺'
const CHERRY = '🍒'
const EMPTY = ' '

const BG_MUSIC = new Audio('aud/pacman-theme-remix.mp3')
const GAME_OVER_SOUND = new Audio('aud/game-over.wav')
const VICTORY_SOUND = new Audio('aud/victory.wav')

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCount
var gCherryInterval

const gElPlayAgainModal = document.querySelector('.play-again-modal')

function onInit() {
    gElPlayAgainModal.innerHTML = `<h3><h3>
    <button onclick="onPlayGame()">Play Game</button>`
}

function onPlayGame() {
    playSound(BG_MUSIC)
    clearInterval(gCherryInterval)
    clearInterval(gIntervalGhosts)
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    renderBoard(gBoard)
    gGame.score = 0
    const elH2 = document.querySelector('h2')
    elH2.querySelector('span').innerText = 0
    elH2.hidden = false
    gGame.isOn = true
    gFoodCount = countFood(gBoard) + 1
    gDeadGhosts = []
    gCherryInterval = setInterval(addCherry, 1000 * 15)
    gElPlayAgainModal.querySelector('h3').hidden = true
    gElPlayAgainModal.querySelector('button').innerText = 'Restart'
}

function buildBoard() {
    const size = 10
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }
    board[1][1] = board[board.length - 2][1] = board[1][board[0].length - 2] = board[board.length - 2][board[0].length - 2] = SUPER_FOOD
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
    renderGhosts()
    renderCell(gPacman.location, getPacmanHTML())
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score

}

function winGame() {
    playSound(VICTORY_SOUND)
    gElPlayAgainModal.querySelector('h3').innerText = 'Victory! 🥳'
    gameOver()
}

function loseGame() {
    gElPlayAgainModal.querySelector('h3').innerText = 'Game over 😭'
    BG_MUSIC.pause()
    playSound(GAME_OVER_SOUND)
    gameOver()
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, EMPTY)
    gElPlayAgainModal.querySelector('h3').hidden = false
    gElPlayAgainModal.querySelector('button').innerText = 'Play Again'
}

function countFood(board) {
    var counter = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === FOOD) counter++
        }
    }
    return counter
}

function addCherry() {
    const emptyLocation = getEmptyLocation(gBoard)
    if (!emptyLocation) return
    gBoard[emptyLocation.i][emptyLocation.j] = CHERRY
    renderCell(emptyLocation, CHERRY)
}

function getEmptyLocation(board) {
    const emptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) emptyLocations.push({ i, j })
        }
    }
    if (!emptyLocations.length) return null
    return emptyLocations.splice(getRandomInt(0, emptyLocations.length), 1)[0]
}

function playSound(sound) {
    sound.currentTime = 0
    sound.play()
}