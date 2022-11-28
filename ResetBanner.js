export class ResetBanner{
    constructor(board, win){
        this.board = board;
        this.element = document.createElement('div');
        this.element.classList.add('reset-banner');
        this.element.innerText = (win ? 'You Win!' : 'You Lose!') + '\nClick to play again';
        this.element.addEventListener('click', () => {
            this.board.reset();
        })
        document.body.appendChild(this.element);
    }
}