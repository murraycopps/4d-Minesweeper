import * as THREE from './node_modules/three/build/three.module.js';
import { Number } from './Number.js';
export class Cube {
    constructor(x, y, z, board) {
        this.x = x
        this.y = y
        this.z = z
        this.board = board
        this.number = 0;
        this.flagged = false;
        this.checked = false;
        this.numberElement = null
        this.mine = false;
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }))

        this.cube.position.set(x * 1.1, y * 1.1, z * 1.1);
    }

    check() {
        if (this.checked || this.flagged) return;
        if (!this.board.playing && !this.mine) return;
 
        this.checked = true;
        if (this.mine) {
            this.cube.material.color.setHex(0xff0000);
            this.cube.visible = false;
            if(this.board.playing) this.board.lose();
            return
        }
        this.cube.visible = false;
        if (this.number === 0) {
            this.board.checkAdjacent(this.x, this.y, this.z);
        }
        this.board.checkWin();
    }
    loadMine() {
        this.number = -1;
        this.mine = true;
        this.numberElement = new Number('x', this.x * 1.1, this.y * 1.1, this.z * 1.1, this.board)
    }
    changeNumber() {
        this.number++;
    }
    loadNumber() {
        if (this.number === 0) return;
        this.numberElement = new Number(this.number, this.x * 1.1, this.y * 1.1, this.z * 1.1, this.board)
    }
    flag() {
        if (this.checked) return;
        this.flagged = !this.flagged;
        if (this.flagged) {
            this.cube.material.color.set(0xff0000);
        }
        else {
            this.cube.material.color.set(0x00ff00);
        }

    }
}