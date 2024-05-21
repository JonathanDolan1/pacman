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
    var moveDiff = getMoveDiff()
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === WALL || nextCell === GHOST) {
        renderCell(ghost.location, getGhostHTML(ghost))
        return
    }
    if (nextCell === PACMAN) {
        if (!gPacman.isSuper) {
           loseGame()
        } else {
            moveGhostToDeadGhosts(ghost.location)
            removeGhostFromCurrLoc(ghost)
            GHOST_KILL_SOUND.play()
            return
        }
    }
    removeGhostFromCurrLoc(ghost)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    renderCell(ghost.location, getGhostHTML(ghost))
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

function reviveGhosts(){
    const deadGhostsLength = gDeadGhosts.length
    for (var i = 0 ; i < deadGhostsLength ; i ++){
        const ghost = gDeadGhosts.pop(1)
        gGhosts.push(ghost)
        renderCell(ghost.location, getGhostHTML(ghost))
    }
    for (i = 0 ; i<gGhosts.length ; i++){
        renderCell(gGhosts[i].location,getGhostHTML(gGhosts[i]))
    }
}

function removeGhostFromCurrLoc(ghost){
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
            renderCell(ghost.location, ghost.currCellContent)
}

function moveGhostToDeadGhosts(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j){
            const deadGhost = gGhosts.splice(i, 1)[0]
            gDeadGhosts.push(deadGhost)
        }
    }
}

function getGhostAtLocation(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j){
            const ghost = gGhosts[i]
            return ghost
        }
    }
    return null
}