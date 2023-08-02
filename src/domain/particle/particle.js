const friction = 0.99;
export class Particle {
    constructor({x, y, radius, color, velocity, context}) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.context = context;
    }

    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.restore();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.slowDown();
        this.alpha -= 0.01;
    }
    slowDown() {
        this.velocity.x *= friction;
        this.velocity.y *= friction;
    }
}
