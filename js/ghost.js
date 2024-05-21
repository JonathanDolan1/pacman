'use strict'

const GHOST = '👻'
var gGhosts
var gDeadGhosts
var gIntervalGhosts

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)

}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    while (true) {
        var moveDiff = getMoveDiff()
        var nextLocation = {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }
        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        if (nextCell === WALL || nextCell === GHOST) {
            // renderCell(ghost.location, getGhostHTML(ghost))
            continue
        }
        if (nextCell === PACMAN) {
            if (!gPacman.isSuper) {
                loseGame()
            } else {
                continue
            }
        }
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)
        ghost.location = nextLocation
        ghost.currCellContent = nextCell
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
        break
    }
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)
    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const ghostColor = (gPacman.isSuper) ? 'rgba(0, 30, 161, 0.814)' : ghost.color
    return `<span style="color: transparent; text-shadow: 0 0 0 ${ghostColor};">${GHOST}</span>`
}

function reviveGhosts() {
    const deadGhostsLength = gDeadGhosts.length
    for (var i = 0; i < deadGhostsLength; i++) {
        const ghost = gDeadGhosts.pop(1)
        gGhosts.push(ghost)
        renderCell(ghost.location, getGhostHTML(ghost))
        if (ghost.location.i === gPacman.location.i && ghost.location.j === gPacman.location.j) loseGame()
    }
    renderGhosts()
}

function killGhost(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
            const ghost = gGhosts.splice(i, 1)[0]
            gDeadGhosts.push(ghost)
            playSound(GHOST_KILL_SOUND)
            if (ghost.currCellContent === FOOD) {
                ghost.currCellContent = EMPTY
                eatFood()
            }
        }
    }
}

function renderGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}