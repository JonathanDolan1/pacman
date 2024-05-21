'use strict'

const PACMAN = '😀'
var gPacman

const EATING_SOUND = new Audio('aud/pacman-eating.mp3')
const EATING_CHERRY_SOUND = new Audio('aud/cherry-bite.wav')
const EATING_SUPER_FOOD_SOUND = new Audio('aud/super.wav')
const GHOST_KILL_SOUND = new Audio('aud/ghost-kill.wav')

function createPacman(board) {
    gPacman = {
        location: {
            i: 6,
            j: 6
        },
        isSuper: false,
        degrees: 180
        // direction: 'ArrowLeft'
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function eatFood(){
    updateScore(1)
    gFoodCount--
    if (gFoodCount === 0) winGame()
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    var nextLocation = getNextLocation(ev)
    if (!nextLocation) return
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === WALL) return
    if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            loseGame()
            return
        } else {
            killGhost(nextLocation)
        }
    }
    if (nextCell === FOOD) {
        playSound(EATING_SOUND)
        eatFood()
    } else if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        playSound(EATING_SUPER_FOOD_SOUND)
        gPacman.isSuper = true;
        renderGhosts();
        setTimeout(()=>{
            gPacman.isSuper = false;
            if (gGame.isOn) reviveGhosts()
        }, 5000)
    } else if (nextCell === CHERRY) {
        updateScore(10)
        EATING_CHERRY_SOUND.currentTime=0
        EATING_CHERRY_SOUND.play()
    }
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    renderCell(gPacman.location, EMPTY)
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    renderCell(gPacman.location, getPacmanHTML())
}

function getPacmanHTML() {
    return `<img style="transform: rotate(${gPacman.degrees}deg)" src="img/pacman.gif"/>`
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            gPacman.degrees = -90
            nextLocation.i--
            break
            case 'ArrowDown':
            gPacman.degrees = 90
            nextLocation.i++
            break
            case 'ArrowLeft':
            gPacman.degrees = 180
            nextLocation.j--
            break
            case 'ArrowRight':
            gPacman.degrees = 0
            nextLocation.j++
            break
        default:
            return null
    }
    renderCell(gPacman.location, getPacmanHTML())
    return nextLocation
}