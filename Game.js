import { Board } from './Board.js';
import {ResetScreen} from './ResetScreen.js';
export class Game{
    constructor(target, sideLength, numMines){
        this.target = target;
        this.sideLength = sideLength;
        this.numMines = numMines;
        this.board = new Board(this.target, this, this.sideLength, this.numMines);
        this.resetScreen = null;
    }
    gameOver(win){
        this.board.playing = false;
        this.resetScreen = new ResetScreen(this.target, this, win);
    }
    restart(){
        this.board.target.innerHTML = '';
        this.board = new Board(this.target, this, this.sideLength, this.numMines);
        this.resetScreen = null;
    }

}