export class Square{
    constructor(x, y, z, board){
        this.x = x;
        this.y = y;
        this.z = z;
        this.mine = false;
        this.checked = false;
        this.flagged = false;
        this.number = 0;
        this.board = board;
        this.element = document.createElement('div');
        this.element.classList.add('square');
        this.element.innerText = this.number === -1 ? '💣' : this.number === 0 ? '' : this.number;
        this.element.addEventListener('click', () => {
            this.check();
        }
        )
        this.element.addEventListener('contextmenu', (e) => {
            if(!this.board.playing) return;
            e.preventDefault();
            this.flag();
        })
        this.element.addEventListener('mouseover', (e) => {
            if(!this.board.playing) return;
            this.board.hover(this.x, this.y, this.z);
        })
    }
    check(){
        if(this.checked || this.flagged || !this.board.playing) return;
        this.board.checkWin();
        if(this.mine){
            this.element.classList.add('mine');
            this.element.innerText = '💣';
            this.board.lose();
        }
        this.checked = true;
        this.element.classList.add('checked');
        if(this.number === 0){
            this.board.checkAdjacent(this.x, this.y, this.z);
        }
    }
    loadMine(){
        this.number = -1;
        this.mine = true;
        this.element.innerText = '💣';
    }
    changeNumber(){
        this.number++;
        this.element.innerText = this.number;
    }
    flag(){
        if(this.checked) return;
        this.flagged = !this.flagged;
        this.element.classList.toggle('flagged');
    }
    
}