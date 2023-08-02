import {audio} from "../../asset/audio";

export class Projectile {
    constructor({x, y, radius, color, velocity, context}) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export class ProjectileManager {
    constructor({player, attackSpeedPerOneSec, context}) {
        this.player = player;
        this.attackSpeedPerOneSec = attackSpeedPerOneSec || 1;
        this.context = context;
        this.nearEnemy = null;
        this.radius = 5;
        this.projectiles = [];
    }

    shootProjectile() {
        if (!this.nearEnemy) {
            return;
        }
        audio.shootAudio.play();
        const angle = Math.atan2(this.nearEnemy.y - this.player.y, this.nearEnemy.x - this.player.x);
        this.projectiles.push(new Projectile({
            x: this.player.x,
            y: this.player.y,
            radius: this.radius,
            color: "white",
            velocity: {
                x: Math.cos(angle) * 6,
                y: Math.sin(angle) * 6,
            },
            context: this.context,
        }))
    }
    setIntervalShooting() {
        this.projectileShootIntervalId = setInterval(() => {
            this.shootProjectile();
        }, 1000 / this.attackSpeedPerOneSec)
    }
    setEnemyNearPlayer(enemy) {
        this.nearEnemy = enemy;
    }
    removeIntervalShooting() {
        this.stopShootProjectile();
    }
    addAttackSpeed(powerUp) {
        if (this.attackSpeedPerOneSec > 5) {
            return;
        }
        this.removeIntervalShooting();
        this.attackSpeedPerOneSec += powerUp;
        this.setIntervalShooting();
    }
    addSize(powerUp) {
        this.radius += powerUp;
    }

    startShootProjectile() {
        this.setIntervalShooting();
    }
    stopShootProjectile() {
        clearInterval(this.projectileShootIntervalId);
    }
}
