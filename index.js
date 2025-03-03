const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let board;
let player;
let gameOver;
let dimension = 3;

startGame();
addResetListener();

function startGame () {
    board = [];
    for (let i = 0; i < dimension; i++) {
        board.push(Array(dimension).fill(EMPTY));
    }
    player = CROSS;
    gameOver = false;
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (gameOver || board[row][col] !== EMPTY) {
        return;
    }
    board[row][col] = player;
    renderSymbolInCell(player, row, col)

    const winningCells = checkWinner(player);
    if (winningCells) {
        gameOver = true;
        highlightWinningCells(winningCells);
        alert(`Победил ${player}!`);
        return;
    }

    if (board.flat().every(cell => cell !== EMPTY)) {
        alert("Победила дружба!");
        gameOver = true;
        return;
    }

    player = player === CROSS ? ZERO : CROSS;
    if (player === ZERO) AIMove();
}

function checkWinner(player) {

    for (let i = 0; i < dimension; i++) {
        if (board[i].every(cell => cell === player)) {
            return board[i].map((_, j) => [i, j]);
        }
        if (board.map(row => row[i]).every(cell => cell === player)) {
            return board.map((_, j) => [j, i]);
        }
    }

    if (board.map((row, i) => row[i]).every(cell => cell === player)) {
        return board.map((_, i) => [i, i]);
    }
    if (board.map((row, i) => row[dimension - i - 1]).every(cell => cell === player)) {
        return board.map((_, i) => [i, dimension - i - 1]);
    }

    return null;
}

function AIMove () {
    let cellsToStep = [];
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === EMPTY) cellsToStep.push([i, j]);
        }
    }
    if (cellsToStep.length === 0) return;

    let [row, col] = cellsToStep[Math.floor(Math.random() * cellsToStep.length)];
    cellClickHandler(row, col);
}

function highlightWinningCells(cells) {
    cells.forEach(([row, col]) => renderSymbolInCell(board[row][col], row, col, 'red'));
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
