import { Cube } from "./Cube.js";
import { Number } from './Number.js';
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './THREE_problems/OrbitControls.js'
export class ThreeBoard {
    constructor(sideLength, numMines, game) {
        this.playing = true;
        this.scene = new THREE.Scene();
        //create a 2d array of cubes
        this.cubes = [];
        this.sideLength = sideLength;
        this.numMines = numMines;
        this.game = game;
        for (let i = 0; i < sideLength; i++) {
            this.cubes[i] = [];
            for (let j = 0; j < sideLength; j++) {
                this.cubes[i][j] = [];
                for (let k = 0; k < sideLength; k++) {
                    const cube = new Cube(i, j, k, this);
                    let edges = new THREE.EdgesGeometry(cube.cube.geometry);
                    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
                    line.linewidth = 4
                    cube.cube.add(line);
                    this.scene.add(cube.cube);
                    this.cubes[i][j][k] = cube;
                }
            }
        }
        // this.camera = new THREE.PerspectiveCamera(60, 320 / 320, 0.1, 1000);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(8, 13, 8);
        this.camera.lookAt(sideLength / 2, sideLength / 2, sideLength / 2);
        this.renderer = new THREE.WebGLRenderer();
        // this.renderer.setSize(720, 720);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.screenSpacePanning = true;
        this.controls.update()
        const element = this

        let drag = false;

        document.addEventListener(
            'mousedown', () => drag = false);
      
        document.addEventListener(
            'mousemove', () => drag = true);

        document.addEventListener('mouseup', onDocumentMouseDown, false);

        var raycaster = new THREE.Raycaster(); // create once
        var mouse = new THREE.Vector2(); // create once

        function onDocumentMouseDown(event) {
            if (!element.playing || drag) return;

            if (event.which == 1) {
                event.preventDefault();

                mouse.x = (event.clientX / element.renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = - (event.clientY / element.renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, element.camera);

                var intersects = raycaster.intersectObjects(element.scene.children, true);
                for (let object of intersects) {
                    if (object.object.type == "Mesh" && object.object.geometry.type == "BoxGeometry") {
                        let x = object.object.position.x / 1.1;
                        let y = object.object.position.y / 1.1;
                        let z = object.object.position.z / 1.1;
                        if (!element.cubes[x][y][z].checked) {
                            element.cubes[x][y][z].check()
                            break
                        }
                    }
                }
            }
            else if (event.which == 3) {
                event.preventDefault();

                mouse.x = (event.clientX / element.renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = - (event.clientY / element.renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, element.camera);

                var intersects = raycaster.intersectObjects(element.scene.children, true);
                for (let object of intersects) {
                    if (object.object.type == "Mesh" && object.object.geometry.type == "BoxGeometry") {
                        let x = object.object.position.x / 1.1;
                        let y = object.object.position.y / 1.1;
                        let z = object.object.position.z / 1.1;
                        if (!element.cubes[x][y][z].checked) {
                            element.cubes[x][y][z].flag()
                            break
                        }
                    }
                }
            }
        }
        animate();

        function animate() {
            requestAnimationFrame(animate);
            element.controls.update();
            element.renderer.render(element.scene, element.camera);
        }

        this.renderer.render(this.scene, this.camera);
        this.generateMines();
        this.changeNumbers();


    }
    generateMines() {
        let mines = 0;
        this.mines = [];
        while (mines < this.numMines) {
            let x = Math.floor(Math.random() * this.sideLength);
            let y = Math.floor(Math.random() * this.sideLength);
            let z = Math.floor(Math.random() * this.sideLength);
            if (this.cubes[x][y][z].number != -1) {
                this.cubes[x][y][z].loadMine();
                mines++;
                this.mines.push(this.cubes[x][y][z]);
            }
        }
    }
    changeNumbers() {
        for (let mine of this.mines) {
            this.changeAdjacent(mine.x, mine.y, mine.z);
        }
        for (let cube of this.cubes) {
            for (let cube2 of cube) {
                for (let cube3 of cube2) {
                    if (cube3.number != -1) {
                        cube3.loadNumber();
                        // cube3.check();
                    }
                }
            }
        }
    }
    changeAdjacent(x, y, z) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                for (let k = -1; k < 2; k++) {
                    if (this.cubes[x + i] && this.cubes[x + i][y + j] && this.cubes[x + i][y + j][z + k] && !this.cubes[x + i][y + j][z + k].mine) {
                        this.cubes[x + i][y + j][z + k].changeNumber();
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
                        if (!this.cubes[x + i][y + j][z + k].checked) {
                            this.cubes[x + i][y + j][z + k].check();
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
                    if (this.cubes[i][j][k].checked) {
                        numChecked++;
                    }
                }
            }
        }
        if (numChecked === this.sideLength ** 3 - this.numMines) {
            this.win();
        }
    }
    win() {
        console.log('win');
        this.playing = false;
        for (let mine of this.mines) {
            if(mine.flagged) mine.flag();
            mine.check();
        }
        this.game.gameOver(true);
    }
    lose() {
        console.log('lose');
        this.playing = false;
        for (let mine of this.mines) {
            if(mine.flagged) mine.flag();
            mine.check();
        }
        this.game.gameOver(false);
    }
}

