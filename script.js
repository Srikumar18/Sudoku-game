const sudokuBoardBody = document.getElementById('sudoku-board-body');
const inputs = document.querySelectorAll('.sudoku-board input');

const createBoard = function(sudokuBoardBody){
    for (let row = 0; row < 9; row++){
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++){
            const td = document.createElement('td');
            const input = document.createElement('input');

            input.type = "number";
            input.maxLength = 1;
            input.min = 1;
            input.max = 9;
            input.dataset.row = row;
            input.dataset.col = col;
            //Keeps only the last character
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 1)
                    e.target.value = value.slice(-1); 
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
                if (e.key >= '1' && e.key <= '9') {
                    e.preventDefault();
                    this.value = e.key;
                    td.classList.add('selected');
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    this.value = '';
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
};   

createBoard(sudokuBoardBody);

// Store the selected difficulty mode from localStorage for use in the game
window.sudokuDifficulty = localStorage.getItem('sudokuDifficulty') || 'easy';

// 5. Deselect all when clicking outside the board
document.addEventListener('click', function(e) {
    if (!e.target.closest('.sudoku-board')) {
        document.querySelectorAll('.sudoku-board td.selected')
            .forEach(cell => cell.classList.remove('selected'));
    }
});

