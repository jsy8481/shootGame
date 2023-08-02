import {makeRandomColor} from "../../lib/color";
import {getOutsideCanvasPosition} from "../../lib/canvas";

export class Enemy {
    constructor({enemyMove, radius, color, context}) {
        this.enemyMove = enemyMove;
        this.radius = radius;
        this.color = color;
        this.context = context;
    }

    draw() {
        const {x, y} = this.enemyMove.update();

        this.context.beginPath();
        this.context.arc(x, y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    get x() {
        return this.enemyMove.x;
    }
    get y() {
        return this.enemyMove.y;
    }
}

// 인터페이스 느낌으로 쓰고
class EnemyMove {
    constructor({x, y, velocity, direction}) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.direction = direction;
    }

    // getNewXY 부분을 수정해서 사용
    _getNewXY() {
        return {
            x: this.x,
            y: this.y,
        }
    }

    // 다음 번 좌표를 반환하고 업데이트합니다.
    update() {
        const {x, y} = this._getNewXY();

        this.x = x;
        this.y = y;
        return {
            x,
            y,
        }
    }
}

class LinearEnemyMove extends EnemyMove {
    constructor({x, y, velocity, direction}) {
        super({x, y, velocity, direction});
    }
    _getNewXY() {
        return {
            x: this.x + this.direction.x * this.velocity,
            y: this.y + this.direction.y * this.velocity,
        }
    }
}

class SpinEnemyMove extends EnemyMove {
    constructor({x, y, velocity, direction, radius}) {
        super({x, y, velocity, direction});
        this.radian = 0;
        this.radius = radius;
        this.centerX = this.x;
        this.centerY = this.y;
    }

    // centerX, centerY를 지속적으로 감시해야 된다.
    _getNewXY() {
        return {
            x: this.centerX + Math.cos(this.radian) * this.radius,
            y: this.centerY + Math.sin(this.radian) * this.radius,
        };
    }

    update() {
        this.centerX += this.direction.x * this.velocity;
        this.centerY += this.direction.y * this.velocity;
        this.radian += 0.1;

        return super.update();
    }
}

class HomingEnemyMove extends EnemyMove{
    constructor({x, y, velocity, direction, player}) {
        super({x, y, velocity, direction});
        this.player = player;
    }
    _getNewXY() {
        return {
            x: this.x + this.direction.x * this.velocity,
            y: this.y + this.direction.y * this.velocity,
        };
    }
    update() {
        const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        this.direction.x = Math.cos(angle);
        this.direction.y = Math.sin(angle);
        return super.update();
    }
}

export function makeRandomEnemy({x, y, velocity, player, context, radius}) {
    const threshold = Math.random();

    const direction = {x: 0, y: 0};
    const angle = Math.atan2(player.y - y, player.x - x);
    direction.x = Math.cos(angle);
    direction.y = Math.sin(angle);

    let enemyMove;
    if (threshold < 0.5) {
        enemyMove = new LinearEnemyMove({
            x,
            y,
            velocity,
            direction,
        })
    } else if (threshold < 0.8) {
        enemyMove = new HomingEnemyMove({
            x,
            y,
            velocity,
            direction,
            player
        });
    } else {
        enemyMove = new SpinEnemyMove({
            x,
            y,
            velocity,
            direction,
            radius,
        })
    }
    return new Enemy({
        enemyMove,
        radius,
        color: makeRandomColor(),
        context,
    })
}

export class EnemiesManager {
    constructor({player, canvas}) {
        this.enemies = [];
        this.spawnIntervalId = null;

        this.minRadius = 10;
        this.maxRadius = 25;

        this.player = player;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        setInterval(() => {
            this.maxRadius += 10;
        }, 10000)
    }
    spawnEnemy() {
        this.spawnIntervalId = setInterval(() => {
            const radius = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
            const {x, y} = getOutsideCanvasPosition({canvas: this.canvas, radius});

            const enemy = makeRandomEnemy({
                x,
                y,
                velocity: 1.5,
                player: this.player,
                context: this.context,
                radius,
            })
            this.enemies.push(enemy);
        }, 1000);
    }
    stopSpawnEnemy() {
        clearInterval(this.spawnIntervalId);
    }
}

export default {
    Enemy,
    EnemiesManager,
    makeRandomEnemy,
}
