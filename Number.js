import { FontLoader } from './THREE_problems/FontLoader.js'
import { TextGeometry } from './THREE_problems/TextGeometry.js'
import * as THREE from './node_modules/three/build/three.module.js';
export class Number {
    constructor(text, x, y, z, board) {
        this.text = text.toString();
        this.x = x
        this.y = y
        this.z = z
        this.board = board
        const offset = 0.45;
        this.loaded = false;

        const fontLoader = new FontLoader()
        fontLoader.load(
            'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json',
            (font) => {
                console.log('loaded')
                this.element = new THREE.Mesh(
                    new TextGeometry(this.text, {
                        font: font,
                        size: 0.9,
                        height: 0.2,
                    }),
                    new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
                this.element.position.set(this.x - offset, this.y - offset, this.z )
                let edges = new THREE.EdgesGeometry(this.element.geometry);
                let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
                if(this.text === 'x'){
                    this.element.material.color.setHex(0xff0000);
                    line.material.color.setHex(0xff0000);
                }
                line.linewidth = 4
                this.element.add(line);
                this.board.scene.add(this.element)
                this.loaded = true
            }
        )
        this.number = 0;
    }
}