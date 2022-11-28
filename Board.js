import { Square } from './Square.js';
export class Board {
    constructor(sideLength = 5, numMines = 5) {
        this.sideLength = sideLength;
        this.numMines = numMines;
        this.squares = [];
        this.parent = document.querySelector('#game');

        this.parent.addEventListener('mouseover', (e) => {
            if (!e.target.classList.contains('square')) {
                this.hover(-1, -1, -1);
            }
        })
        this.boards = []
        this.playing = true;
        for (let i = 0; i < sideLength; i++) {
            this.squares[i] = [];

            //create a new board
            let board = document.createElement('div');
            board.classList.add('board');
            // if (sideLength * sideLength * 50 > window.innerWidth) {
            //     board.style.width = `${sideLength * 25}px`;
            //     board.style.height = `${sideLength * 25}px`;
            //     board.style.fontSize = `${.5}rem`;
            //     this.parent.style.gridTemplateColumns = `repeat(${this.sideLength}, 1fr)`;
            //     this.parent.style.gridTemplateRows = `repeat(${this.sideLength}, 1fr)`;
            // }
            // else {
                board.style.width = `${sideLength * 50}px`;
                board.style.height = `${sideLength * 50}px`;
                this.parent.style.gridTemplateColumns = `repeat(${this.sideLength}, 1fr)`;
                this.parent.style.gridTemplateRows = `repeat(1, 1fr)`;
            // }
            board.style.gridTemplateColumns = `repeat(${sideLength}, 1fr)`;
            board.style.gridTemplateRows = `repeat(${sideLength}, 1fr)`;
            this.parent.appendChild(board);
            this.boards.push(board);

            for (let j = 0; j < sideLength; j++) {
                this.squares[i][j] = [];
                for (let k = 0; k < sideLength; k++) {
                    this.squares[i][j][k] = new Square(i, j, k, this);
                    board.appendChild(this.squares[i][j][k].element);
                }
            }
        }
        this.generateMines();
        this.changeNumbers();
        //select a random square with a number of 0 to start
        let x = Math.floor(Math.random() * this.sideLength);
        let y = Math.floor(Math.random() * this.sideLength);
        let z = Math.floor(Math.random() * this.sideLength);
        while (this.squares[x][y][z].number !== 0) {
            x = Math.floor(Math.random() * this.sideLength);
            y = Math.floor(Math.random() * this.sideLength);
            z = Math.floor(Math.random() * this.sideLength);
        }
        this.squares[x][y][z].check();
    }
    generateMines() {
        let numMines = 0;
        this.mines = [];
        while (numMines < this.numMines) {
            let x = Math.floor(Math.random() * this.sideLength);
            let y = Math.floor(Math.random() * this.sideLength);
            let z = Math.floor(Math.random() * this.sideLength);
            if (!this.squares[x][y][z].mine) {
                this.squares[x][y][z].loadMine();
                this.mines.push(this.squares[x][y][z]);
                numMines++;
            }
        }
    }
    changeNumbers() {
        for (let mine of this.mines) {
            this.changeAdjacent(mine.x, mine.y, mine.z);
        }
    }
    changeAdjacent(x, y, z) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    if (this.squares[x + i] && this.squares[x + i][y + j] && this.squares[x + i][y + j][z + k] && !this.squares[x + i][y + j][z + k].mine) {
                        this.squares[x + i][y + j][z + k].changeNumber();
                    }
                }
            }
        }
    }
    checkAdjacent(x, y, z) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    if (x + i >= 0 && x + i < this.sideLength && y + j >= 0 && y + j < this.sideLength && z + k >= 0 && z + k < this.sideLength) {
                        if (!this.squares[x + i][y + j][z + k].checked) {
                            this.squares[x + i][y + j][z + k].check();
                        }
                    }
                }
            }
        }
    }
    hover(x, y, z) {
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    this.squares[i][j][k].element.classList.remove('hover');
                }
            }
        }
        if (x >= 0 && y >= 0 && z >= 0) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        if (x + i >= 0 && x + i < this.sideLength && y + j >= 0 && y + j < this.sideLength && z + k >= 0 && z + k < this.sideLength) {
                            this.squares[x + i][y + j][z + k].element.classList.add('hover');
                        }
                    }
                }
            }
        }
    }
    checkWin() {
        let numChecked = 0;
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    if (this.squares[i][j][k].checked) {
                        numChecked++;
                    }
                }
            }
        }
        if (numChecked === this.sideLength ** 3 - 5) {
            this.win();
        }
    }
    win() {
        console.log('win');
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    this.squares[i][j][k].element.classList.add('checked');
                }
            }
        }
        for (let mine of this.mines) {
            mine.element.classList.add('mine');
        }
        this.parent.classList.add('win');
    }
    lose() {
        console.log('lose');
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    this.squares[i][j][k].element.classList.add('checked');
                }
            }
        }
        for (let mine of this.mines) {
            mine.element.classList.add('mine');
        }
        this.parent.classList.add('lose');
    }
}