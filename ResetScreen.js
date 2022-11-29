export class ResetScreen{
    constructor(target, game, win){
        this.game = game;
        this.element = document.createElement('div');
        this.element.classList.add('reset-screen');
        this.element.innerText = win ? 'You Win!' : 'You Lose!';
        this.button = document.createElement('button');
        this.button.classList.add('reset-button');
        this.button.innerText = 'Restart';
        this.button.addEventListener('click', () => {
            this.game.restart();
        })
        this.element.appendChild(this.button);
        target.appendChild(this.element);
    }
}