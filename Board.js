import { Square } from './Square.js';
export class Board {
    constructor(target, game, sideLength = 5, numMines = 5) {
        this.game = game;
        this.sideLength = sideLength;
        this.numMines = numMines;
        this.squares = [];
        this.target = target;
        document.body.addEventListener('mouseover', (e) => {
            if (!e.target.classList.contains('square')) {
                this.hover(-1, -1, -1, -1);
            }
        })
        this.boards = []
        this.playing = true;
        for (let i = 0; i < sideLength; i++) {
            this.squares[i] = [];
            for (let j = 0; j < sideLength; j++) {
                this.squares[i][j] = []

                let board = document.createElement('div');
                board.classList.add('board');

                board.style.width = `${sideLength * 40}px`;
                board.style.height = `${sideLength * 40}px`;
                this.target.style.gridTemplateColumns = `repeat(${this.sideLength}, 1fr)`;
                this.target.style.gridTemplateRows = `repeat(${this.sideLength}, 1fr)`;                

                board.style.gridTemplateColumns = `repeat(${sideLength}, 1fr)`;
                board.style.gridTemplateRows = `repeat(${sideLength}, 1fr)`;
                this.target.appendChild(board);
                this.boards.push(board);

                for (let k = 0; k < sideLength; k++) {
                    this.squares[i][j][k] = [];
                    for (let w = 0; w < sideLength; w++) {
                        this.squares[i][j][k][w] = new Square(i, j, k, w, this);
                        board.appendChild(this.squares[i][j][k][w].element);
                    }
                }
            }
        }
        this.generateMines();
        this.changeNumbers();
        //select a random square with a number of 0 to start
        let x = Math.floor(Math.random() * this.sideLength);
        let y = Math.floor(Math.random() * this.sideLength);
        let z = Math.floor(Math.random() * this.sideLength);
        let w = Math.floor(Math.random() * this.sideLength);
        while (this.squares[x][y][z][w].number !== 0) {
            x = Math.floor(Math.random() * this.sideLength);
            y = Math.floor(Math.random() * this.sideLength);
            z = Math.floor(Math.random() * this.sideLength);
            w = Math.floor(Math.random() * this.sideLength);
        }
        this.squares[x][y][z][w].check();
    }
    generateMines() {
        let numMines = 0;
        this.mines = [];
        while (numMines < this.numMines) {
            let x = Math.floor(Math.random() * this.sideLength);
            let y = Math.floor(Math.random() * this.sideLength);
            let z = Math.floor(Math.random() * this.sideLength);
            let w = Math.floor(Math.random() * this.sideLength);
            if (!this.squares[x][y][z][w].mine) {
                this.squares[x][y][z][w].loadMine();
                this.mines.push(this.squares[x][y][z][w]);
                numMines++;
            }
        }
    }
    changeNumbers() {
        for (let mine of this.mines) {
            this.changeAdjacent(mine.x, mine.y, mine.z, mine.w);
        }
    }
    changeAdjacent(x, y, z, w) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        if (this.squares[x + i] && this.squares[x + i][y + j] && this.squares[x + i][y + j][z + k] && this.squares[x + i][y + j][z + k][w + l] && !this.squares[x + i][y + j][z + k][w + l].mine) {
                            this.squares[x + i][y + j][z + k][w + l].changeNumber();
                        }
                    }
                }
            }
        }
    }
    checkAdjacent(x, y, z, w) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        if (x + i >= 0 && x + i < this.sideLength && y + j >= 0 && y + j < this.sideLength && z + k >= 0 && z + k < this.sideLength && w + l >= 0 && w + l < this.sideLength) {
                            if (!this.squares[x + i][y + j][z + k][w + l].checked) {
                                this.squares[x + i][y + j][z + k][w + l].check();
                            }
                        }
                    }
                }
            }
        }
    }
    hover(x, y, z, w) {
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    for (let l = 0; l < this.sideLength; l++) {
                        this.squares[i][j][k][l].element.classList.remove('hover');
                    }
                }
            }
        }
        if (x >= 0 && y >= 0 && z >= 0) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        for (let l = -1; l < 2; l++) {
                            if (x + i >= 0 && x + i < this.sideLength && y + j >= 0 && y + j < this.sideLength && z + k >= 0 && z + k < this.sideLength && w + l >= 0 && w + l < this.sideLength) {
                                this.squares[x + i][y + j][z + k][w + l].element.classList.add('hover');
                            }
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
                    for (let l = 0; l < this.sideLength; l++) {
                        if (this.squares[i][j][k][l].checked) {
                            numChecked++;
                        }
                    }
                }
            }
        }
        if (numChecked === this.sideLength ** 4 - this.numMines) {
            this.win();
        }
    }
    win() {
        console.log('win');
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    for (let l = 0; l < this.sideLength; l++) {
                        this.squares[i][j][k][l].element.classList.add('checked');
                    }
                }
            }
        }
        for (let mine of this.mines) {
            mine.element.classList.add('mine');
        }
        this.target.classList.add('win');
        this.game.gameOver(true)
    }
    lose() {
        console.log('lose');
        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                for (let k = 0; k < this.sideLength; k++) {
                    for (let l = 0; l < this.sideLength; l++) {
                        this.squares[i][j][k][l].element.classList.add('checked');
                    }
                }
            }
        }
        for (let mine of this.mines) {
            mine.element.classList.add('mine');
        }
        this.target.classList.add('lose');
        this.game.gameOver(false)
    }
}