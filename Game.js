import { ResetBanner } from "./ResetBanner.js";
import { ThreeBoard } from "./ThreeBoard.js";
export class Game {
    constructor(sideLength, numMines){
        this.sideLength = sideLength;
        this.numMines = numMines;
        this.board = new ThreeBoard(sideLength, numMines, this);
    }
    gameOver(win){
        console.log('game over');
        this.ResetBanner = new ResetBanner(this, win);
    }
    reset(){
        this.ResetBanner = null;
        document.body.innerHTML = null
        this.board = new ThreeBoard(this.sideLength, this.numMines, this);
    }
}