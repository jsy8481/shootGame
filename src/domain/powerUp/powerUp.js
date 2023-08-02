// const type = {
//     sizeUp: "sizeUp",
//     attackSpeedUp: "attackSpeedUp",
//     moveSpeedUp: "moveSpeedUp",
// }
import {getOutsideCanvasPosition} from "../../lib/canvas";
import {audio} from "@/asset/audio";
import powerup from "@image/powerup.png"
import lightingBolt from "@image/lightningBolt.png";

const imageSrc = {
    sizeUp: powerup,
    attackSpeedUp: lightingBolt,
}

export class PowerUp {
    constructor(
        {
            projectileManager,
            position = {x: 0, y: 0},
            direction = {x: 0, y: 0},
            context,
            type,
        }) {
        this.projectileManager = projectileManager;
        this.position = position;
        this.velocity = 3;
        this.direction = direction;
        this.context = context;
        this.type = type;
        this.image = new Image();
        this.image.src = imageSrc[type];
        this.width = 30;
        this.height = 30;
        this.radians = 0;

        this.alpha = 1;
        gsap.to(this, {
            alpha: 0,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
        });
    }
    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2,
        );
        this.context.rotate(this.radians);
        this.context.translate(
            - this.position.x - this.width / 2,
            - this.position.y - this.height / 2,
        );
        this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        this.context.restore();
    }
    update() {
        this.draw();
        this.position.x += this.direction.x * this.velocity;
        this.position.y += this.direction.y * this.velocity;
        this.radians += 0.01;
    }
    powerUp() {
        audio.powerUpAudio.play();
        if (this.type === "sizeUp") {
            this.projectileManager.addSize(1)
        } else if (this.type === "attackSpeedUp") {
            this.projectileManager.addAttackSpeed(1);
        }
    }
}

export class PowerUpManager {
    constructor({projectileManager, canvas}) {
        this.projectileManager = projectileManager;
        this.canvas = canvas;
        this.intervalId = null;
        this.powerUpWidth = 50;

        this.powerUps = [];
    }

    startSpawnPowerUp() {
        this.intervalId = setInterval(() => {
            const {x, y} = getOutsideCanvasPosition({
                canvas: this.canvas,
                radius: this.powerUpWidth,
                padding: this.powerUpWidth,
            })
            const direction = {x: 0, y: 0}
            if (x < 0) {
                direction.x = 1;
            } else {
                direction.y = 1;
            }
            const type = Math.random() > 0.5 ? "sizeUp" : "attackSpeedUp";
            this.powerUps.push(new PowerUp({
                projectileManager: this.projectileManager,
                position: {
                    x,
                    y,
                },
                context: this.canvas.getContext("2d"),
                direction,
                type,
            }))
        }, 5000)
    }
    stopSpawnPowerUp() {
        clearInterval(this.intervalId);
    }
}
