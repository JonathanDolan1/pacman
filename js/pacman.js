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
        direction: 'ArrowLeft'
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
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
            const ghost = getGhostAtLocation(nextLocation)
            if (ghost.currCellContent === FOOD) {
                ghost.currCellContent = EMPTY
                updateScore(1)
                gFoodCount--
                if (gFoodCount === 0) winGame()
            }
            moveGhostToDeadGhosts(nextLocation)
            GHOST_KILL_SOUND.play()
        }
    }

    if (nextCell === FOOD) {
        updateScore(1)
        gFoodCount--
        EATING_SOUND.play()
        if (gFoodCount === 0) {
            winGame()
        }
    } else if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        EATING_SUPER_FOOD_SOUND.play()
        gPacman.isSuper = true
        for (var i = 0 ; i<gGhosts.length; i++){
            renderCell(gGhosts[i].location,getGhostHTML(gGhosts[i]))
        }
        setTimeout(()=>{
            gPacman.isSuper = false;
            if (gGame.isOn) reviveGhosts()
        }, 5000)
    } else if (nextCell === CHERRY) {
        updateScore(10)
        EATING_CHERRY_SOUND.play()
    }
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    renderCell(gPacman.location, EMPTY)
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    renderCell(gPacman.location, getPacmanHTML())
}

function getPacmanHTML() {
    return `<img src="img/pacman-${gPacman.direction}.jpeg"/>`
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    const currPacmanDirection = gPacman.direction
    gPacman.direction = eventKeyboard.code
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            break
        case 'ArrowDown':
            nextLocation.i++
            break
        case 'ArrowLeft':
            nextLocation.j--
            break
        case 'ArrowRight':
            nextLocation.j++
            break
        default:
            gPacman.direction = currPacmanDirection
            return null
    }
    renderCell(gPacman.location, getPacmanHTML())
    return nextLocation
}