const sudokuBoardBody = document.getElementById('sudoku-board-body');
const inputs = document.querySelectorAll('.sudoku-board input');
const resetBtn = document.querySelector('#resetButton');
const solveBtn = document.querySelector('#solveButton');
const checkBtn = document.querySelector('#checkButton');
const timer = document.querySelector('#timer');

let startTime = 0;
let elapsedTime = 0;
let minutes, seconds, timerId;
let originalPuzzle = null;
let solutionPuzzle = null;
window.difficulty = localStorage.getItem('sudokuDifficulty') || 'easy';

function startTimer(){
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(updateTimer, 1000);
}

function stopTimer(){
    clearInterval(timerId);
    startTime = 0;
    elapsedTime = 0;
}

function updateTimer(){
    const currTime = Date.now();
    elapsedTime = currTime - startTime;
    minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    seconds = Math.floor(elapsedTime / 1000 % 60);
    minutes = String(minutes).padStart(2, 0);
    seconds = String(seconds).padStart(2, 0);
    timer.textContent = `${minutes}:${seconds}`;
}

const createBoard = async function(sudokuBoardBody){
    await getPuzzle(window.difficulty);
    // Deep copy for reset
    originalPuzzle = window.puzzle.map(row => row.slice());
    solutionPuzzle = JSON.parse(JSON.stringify(originalPuzzle));
    solveSudoku(solutionPuzzle);
    
    for (let row = 0; row < 9; row++){
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++){
            const td = document.createElement('td');
            const input = document.createElement('input');
            const val = window.puzzle[row][col];

            input.type = "number";
            input.min = 1;
            input.max = 9;
            input.dataset.row = row;
            input.dataset.col = col;
            input.value = val !== null ? val : '';
            input.disabled = val !== null;
            
            //Keeps only the last character
            input.addEventListener('input', (e) => {
                let value = e.target.value;
                if (value.length > 1)
                    value = value.slice(-1);
                e.target.value = value;
                // Remove error styling if cleared
                if (!value) {
                    e.target.style.border = '';
                    e.target.style.color = '';
                }
            });

            //Highlight selected cell
            input.addEventListener('focus', function() {
                document.querySelectorAll('.sudoku-board td.selected')
                    .forEach(cell => cell.classList.remove('selected'));
                td.classList.add('selected');
            });

            //Focus when clicked
            input.addEventListener('click', function() {
                this.focus();
            });

            //Handle key press input
            input.addEventListener('keydown', function(e) {
                const r = parseInt(this.dataset.row);
                const c = parseInt(this.dataset.col);
                if (e.key >= '1' && e.key <= '9') {
                    e.preventDefault();
                    this.value = e.key;
                    td.classList.add('selected');
                    window.puzzle[r][c] = parseInt(e.key);
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    this.value = '';
                    window.puzzle[r][c] = null;
                }
            });

            //Arrow keys navigation
            input.addEventListener('keydown', function(e) {
                const moveFocus = (row, col) => {
                    if (row >= 0 && row < 9 && col >= 0 && col < 9){
                        const selector = `.sudoku-board input[data-row="${row}"][data-col="${col}"]`;
                        const target = document.querySelector(selector);
                        if (target)
                            target.focus();
                    }
                };
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    moveFocus(row - 1, col);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    moveFocus(row + 1, col);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveFocus(row, col - 1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveFocus(row, col + 1);
                }
            });
            td.appendChild(input);
            tr.appendChild(td);
        }
        sudokuBoardBody.appendChild(tr);
    }
    checkBtn.style.display = 'inline-block';
    solveBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
    document.querySelector('.sudoku-container').style.display = 'block';
    startTimer();
};   

// 5. Deselect all when clicking outside the board
document.addEventListener('click', function(e) {
    if (!e.target.closest('.sudoku-board')) {
        document.querySelectorAll('.sudoku-board td.selected')
            .forEach(cell => cell.classList.remove('selected'));
    }
});

async function getPuzzle(difficulty) {
    await fetch(`https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${window.difficulty}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': '8kqf2JoV7B+Au0OFqITIyw==MnABwZlrgflChd1X'
        }
      })
    .then(res => res.json())
    .then(data => window.puzzle = data.puzzle)
    .catch(err => {
        console.log(err);
    });
}

async function loadPuzzle(){
    await getPuzzle(window.difficulty);
    const inputs = document.querySelectorAll('td input');
    for (let i = 0; i < 81; i++){
        let row = Math.floor(i/9);
        let col = i % 9;
        const val = window.puzzle[row][col];
        inputs[i].value = val !== null ? val : '';
        inputs[i].disabled = val !== null;
    }
    stopTimer();
    startTimer();
}

createBoard(sudokuBoardBody);

const SIZE = 9;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Helper function to check if a number is valid at (row, col)
function isValid(board, row, col, num) {
    for (let i = 0; i < SIZE; i++) {
        if (board[row][i] === num)
            return false; 
        if (board[i][col] === num)
            return false;
        if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num)
            return false;
    }
    return true;
}

// Get all unassigned cells
function getUnassigned(board) {
    const unassigned = [];
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if (!board[r][c]) 
                unassigned.push([r, c]);

    return unassigned;
}

// Forward checking: eliminate impossible values for future cells
function forwardCheck(board, domains) {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c]) {
                domains[r][c] = DIGITS.filter(n => isValid(board, r, c, n));
                if (domains[r][c].length === 0) 
                    return false;
            }
        }
    }
    return true;
}

// AC-3 constraint propagation
function ac3(board, domains) {
    const queue = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c]) {
                getNeighbors(r, c).forEach(([nr, nc]) => {
                    queue.push([[r, c], [nr, nc]]);
                });
            }
        }
    }

    while (queue.length > 0) {
        const [[r1, c1], [r2, c2]] = queue.shift();
        if (revise(domains, r1, c1, r2, c2)) {
            if (domains[r1][c1].length === 0) return false;
            getNeighbors(r1, c1).forEach(([nr, nc]) => {
                if (!(nr === r2 && nc === c2)) {
                    queue.push([[nr, nc], [r1, c1]]);
                }
            });
        }
    }
    return true;
}

function revise(domains, r1, c1, r2, c2) {
    let revised = false;
    const toRemove = [];
    for (let x of domains[r1][c1]) {
        if (domains[r2][c2].length === 1 && domains[r2][c2][0] === x) {
            toRemove.push(x);
            revised = true;
        }
    }
    domains[r1][c1] = domains[r1][c1].filter(x => !toRemove.includes(x));
    return revised;
}

function getNeighbors(row, col) {
    const neighbors = new Set();
    for (let i = 0; i < SIZE; i++) {
        if (i !== col) neighbors.add(`${row},${i}`);
        if (i !== row) neighbors.add(`${i},${col}`);
    }
    const boxRow = 3 * Math.floor(row / 3);
    const boxCol = 3 * Math.floor(col / 3);
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (r !== row || c !== col) neighbors.add(`${r},${c}`);
        }
    }
    return [...neighbors].map(s => s.split(',').map(Number));
}

function solveSudoku(board) {
    const domains = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => [...DIGITS]));
    if (!forwardCheck(board, domains) || !ac3(board, domains)) return false;

    return backtrack(board, domains);
}

function backtrack(board, domains) {
    const unassigned = getUnassigned(board);
    if (unassigned.length === 0) return true;

    // Choose variable with smallest domain (MRV)
    unassigned.sort((a, b) => domains[a[0]][a[1]].length - domains[b[0]][b[1]].length);
    const [row, col] = unassigned[0];

    for (let num of domains[row][col]) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            const newDomains = JSON.parse(JSON.stringify(domains));
            newDomains[row][col] = [num];
            if (forwardCheck(board, newDomains) && ac3(board, newDomains)) {
                if (backtrack(board, newDomains)) return true;
            }
            board[row][col] = null;
        }
    }
    return false;
}
function showMessage(text, color = 'green') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
    }, 3000); // auto-hide after 3 seconds
}

// Button event listeners
let solvedByUser = true; // Track if user solved without using solve button

solveBtn.addEventListener('click', function() {
    const inputs = document.querySelectorAll('.sudoku-board input');
    for (let i = 0; i < 81; i++) {
        let row = Math.floor(i/9);
        let col = i % 9;
        inputs[i].value = solutionPuzzle[row][col];
        window.puzzle[row][col] = solutionPuzzle[row][col];
        inputs[i].disabled = true;
        inputs[i].style.border = '';
        inputs[i].style.color = '';
    }
    stopTimer();
    solvedByUser = false;
    showMessage('Sudoku puzzle solved!', 'green');
});

checkBtn.addEventListener('click', function() {
    const inputs = document.querySelectorAll('.sudoku-board input');
    let hasError = false;
    // Clear previous error styling
    inputs.forEach(input => {
        input.style.border = '';
        input.style.color = '';
    });
    for (let i = 0; i < 81; i++) {
        const input = inputs[i];
        if (input.disabled) continue;
        const value = parseInt(input.value);
        if (value && value >= 1 && value <= 9) {
            const row = Math.floor(i/9);
            const col = i % 9;
            if (window.puzzle[row][col] !== solutionPuzzle[row][col]) {
                input.style.border = '2px solid red';
                input.style.color = 'red';
                hasError = true;
            }
        }
    }
    if (!hasError) {
        const filledCells = Array.from(inputs).filter(input => input.value !== '').length;
        if (filledCells === 81) {
            clearInterval(timerId);
            // Only update top times if user solved without using solve button
            if (solvedByUser) {
                let topTimes = JSON.parse(localStorage.getItem('sudokuTopTimes') || '[]');
                // Parse timer text (mm:ss) to ms
                const [mm, ss] = timer.textContent.split(':').map(Number);
                const ms = mm * 60000 + ss * 1000;
                topTimes.push({ time: ms, difficulty: window.difficulty });
                topTimes = topTimes.sort((a, b) => a.time - b.time).slice(0, 5);
                localStorage.setItem('sudokuTopTimes', JSON.stringify(topTimes));

            }
            showMessage('Congratulations! The puzzle is solved! Time: ' + timer.textContent, 'green');
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 2500); // Redirect after 2.5 seconds
        } else {
            showMessage('No errors found!', 'green');
        }
    } else {
        showMessage('Found errors! Incorrect numbers are highlighted in red.', 'red');
    }
    // Reset solvedByUser for next game
    solvedByUser = true;
});

resetBtn.addEventListener('click', function() {
    showMessage("Puzzle reset!", 'blue');
    window.puzzle = originalPuzzle.map(row => row.slice());
    const inputs = document.querySelectorAll('.sudoku-board input');
    for (let i = 0; i < 81; i++) {
        let row = Math.floor(i/9);
        let col = i % 9;
        const val = window.puzzle[row][col];
        inputs[i].value = val !== null ? val : '';
        inputs[i].disabled = val !== null;
        inputs[i].style.border = '';
        inputs[i].style.color = '';
    }
    stopTimer();
    startTimer();
    solvedByUser = true;
});

