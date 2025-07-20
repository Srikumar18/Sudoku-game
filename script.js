const sudokuBoardBody = document.getElementById('sudoku-board-body');
const inputs = document.querySelectorAll('.sudoku-board input');
const resetBtn = document.querySelector('#resetButton');
const solveBtn = document.querySelector('#solveButton');
const checkBtn = document.querySelector('#checkButton');

const createBoard = async function(sudokuBoardBody){
    await getPuzzle(window.difficulty);
    console.log(window.puzzle);
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
                console.log(window.puzzle);
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
};   

window.difficulty = localStorage.getItem('sudokuDifficulty') || 'easy';

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
}


createBoard(sudokuBoardBody);


