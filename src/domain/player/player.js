import {Projectile} from "../projectile/projectile";

export class Player {
    constructor({x, y, radius, color, canvas}) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.keyboard = new KeyBoard({velocity: 5});
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update() {
        const {velocityX, velocityY} = this.keyboard.update();

        if (this.x + this.radius + velocityX <= this.canvas.width && this.x - this.radius + velocityX > 0) {
            this.x += velocityX;
        }
        if (this.y + this.radius + velocityY <= this.canvas.height && this.y - this.radius + velocityY > 0) {
            this.y += velocityY;
        }
    }
    startMove() {
        window.addEventListener("keydown", (e) => this.keydownHandler(e));
        window.addEventListener("keyup", (e) => this.keyUpHandler(e));
    }
    endMove() {
        window.removeEventListener("keydown", (e) => this.keydownHandler(e));
        window.removeEventListener("keyup", (e) => this.keyUpHandler(e));
    }
    keydownHandler(keyboardEvent) {
        if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(keyboardEvent.key)) {
            keyboardEvent.preventDefault();
            this.keyboard[keyboardEvent.key] = true;
        }
    }
    keyUpHandler(keyboardEvent) {
        this.keyboard[keyboardEvent.key] = false;
    }
}

class KeyBoard {
    constructor({velocity = 1}) {
        this.ArrowRight = false;
        this.ArrowLeft = false;
        this.ArrowDown = false;
        this.ArrowUp = false;
        this.velocity = velocity;
    }
    update() {
        const velocityX = (this.ArrowLeft * (-1) + this.ArrowRight) * this.velocity;
        const velocityY = (this.ArrowUp * (-1) + this.ArrowDown) * this.velocity;
        return {velocityX, velocityY}
    }
}

