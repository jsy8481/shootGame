import {EnemiesManager, makeRandomEnemy} from "@domain/enemy/enemy";
import {Player} from "@domain/player/player";
import {Particle} from "@domain/particle/particle";
import {ProjectileManager} from "@domain/projectile/projectile";
import {PowerUpManager} from "@domain/powerUp/powerUp";
import {
    audio,
    startGameBackGroundAudio,
    stopGameBackGroundAudio,
    muteAllAudio,
    unmuteAllAudio,
} from "@/asset/audio";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gameOverModal = document.querySelector(".game_over_modal");
const gameOverModalScore = document.querySelector(".game_over_model__score");
const gameOverModalRestartButton = document.querySelector(".game_over_modal__restart_button");
const gameStartModal = document.querySelector("#game_start_modal");
const gameStartModalButton = document.querySelector("#game_start_modal_button")
const scoreElement = document.querySelector("#score");
const volumeUp = document.querySelector("#volumeUp");
const volumeOff = document.querySelector("#volumeOff");

volumeOff.addEventListener("click", () => {
    unmuteAllAudio();
    volumeUp.style.display = "block";
    volumeOff.style.display = "none";
});
volumeUp.addEventListener("click", () => {
    muteAllAudio();
    volumeOff.style.display = "block";
    volumeUp.style.display = "none";
});

function showGameOverModal() {
    gsap.fromTo(gameOverModal, {
        scale: 0.8,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1,
        ease: "expo",
        duration: 0.3,
    });
    gameOverModal.style.display = "block";
}
function hideGameOverModal() {
    gsap.to(gameOverModal, {
        opacity: 0,
        scale: 0.8,
        onComplete: () => {
            gameOverModal.style.display = "none";
        }
    })
}
function hideGameStartModal() {
    gsap.to("#game_start_modal", {
        opacity: 0,
        scale: 0.7,
        duration: 0.3,
        ease: "expo",
        onComplete: () => {
            gameStartModal.style.display = "none";
        }
    })
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    endGame();
    context.fillStyle = "rgba(0, 0, 0, 0.1)"
    context.fillRect(0, 0, canvas.width, canvas.height);
})

function updateScore(newScore) {
    score = newScore
    scoreElement.textContent = score;
    gameOverModalScore.textContent = score;
}

function createScoreLabel({addScore, position}) {
    const scoreLabel = document.createElement("label");
    scoreLabel.innerHTML = addScore;
    scoreLabel.style.color = "white";
    scoreLabel.style.position = "absolute";
    scoreLabel.style.left = `${position.x}px`;
    scoreLabel.style.top = `${position.y}px`;
    scoreLabel.style.userSelect = "none";
    document.body.appendChild(scoreLabel);

    gsap.to(scoreLabel, {
        opacity: 0,
        y: -30,
        duration: 1,
        onComplete: () => {
            scoreLabel.remove();
        }
    })
}

let player = null;
let score = 0;
let projectileManager;
let powerUpManager;
let enemiesManager;
let particles = [];
let animationId = null;
let intervalId = null;

gameStartModalButton.addEventListener("click", startGame);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        enemiesManager.stopSpawnEnemy();
        projectileManager.stopShootProjectile();
        powerUpManager.stopSpawnPowerUp();
    } else {
        enemiesManager.spawnEnemy();
        projectileManager.startShootProjectile();
        powerUpManager.startSpawnPowerUp();
    }
})

function startGame() {
    audio.selectAudio.play();
    hideGameStartModal()
    init();
}

function init() {
    startGameBackGroundAudio();
    player = new Player({x: canvas.width / 2, y: canvas.height / 2, radius: 30, color: "white", canvas});
    player.startMove();
    updateScore(0);
    projectileManager = new ProjectileManager({player, attackSpeedPerOneSec: 1, context})
    powerUpManager = new PowerUpManager({
        projectileManager,
        canvas,
    })
    enemiesManager = new EnemiesManager({player, canvas});
    particles = [];
    animationId = null;
    hideGameOverModal();
    animate()
    enemiesManager.spawnEnemy();
    projectileManager.startShootProjectile();
    powerUpManager.startSpawnPowerUp();
}

function endGame() {
    stopGameBackGroundAudio();
    cancelAnimationFrame(animationId);
    showGameOverModal();
    clearInterval(intervalId);
    projectileManager.stopShootProjectile();
    powerUpManager.stopSpawnPowerUp();
    enemiesManager.stopSpawnEnemy();
}

gameOverModalRestartButton.addEventListener("click", () => {
    audio.selectAudio.play();
    init();
});

function animate() {
    animationId = requestAnimationFrame(animate)
    context.fillStyle = "rgba(0, 0, 0, 0.1)"
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();

    for (let index = powerUpManager.powerUps.length-1; index >= 0; index--) {
        const powerUp = powerUpManager.powerUps[index];
        powerUp.update();

        const playerDist = Math.hypot(player.x - powerUp.position.x, player.y - powerUp.position.y);
        if (playerDist < powerUp.width / 2 + player.radius) {
            powerUp.powerUp();
            powerUpManager.powerUps.splice(index, 1);
        }
    }

    const deleteEnemyIndex = [];
    const deleteParticleIndex = [];

    let enemyNearPlayer = null;
    let enemyNearPlayerDist = 1000000000;
    enemiesManager.enemies.forEach((enemy, index) => {
        const playerEnemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (playerEnemyDist - enemy.radius - player.radius <= 0) {
            audio.deathAudio.play();
            endGame();
        }
        if (enemy.x - enemy.radius < -500 ||
            enemy.x + enemy.radius > canvas.width + 500 ||
            enemy.y - enemy.radius < -500 ||
            enemy.y + enemy.radius > canvas.height + 500
        ) {
            deleteEnemyIndex.push(index);
        }
        if (playerEnemyDist < enemyNearPlayerDist) {
            enemyNearPlayer = enemy;
            enemyNearPlayerDist = playerEnemyDist;
        }
    })
    projectileManager.setEnemyNearPlayer(enemyNearPlayer);
    for (let index = projectileManager.projectiles.length - 1; index >= 0; index--) {
        const projectile = projectileManager.projectiles[index];
        if (
            projectile.x - projectile.radius < 0 ||
            projectile.x + projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 ||
            projectile.y + projectile.radius > canvas.height
        ) {
            projectileManager.projectiles.splice(index, 1);
            continue;
        }
        for (let enemyIndex = enemiesManager.enemies.length -1; enemyIndex >= 0; enemyIndex--) {
            const enemy = enemiesManager.enemies[enemyIndex];
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // 적과 미사일이 부딪혔을 때
            if (dist - enemy.radius - projectile.radius <= 0) {
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle({
                        x: projectile.x,
                        y: projectile.y,
                        radius: Math.random() * 3,
                        color: enemy.color,
                        velocity: {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5),
                        },
                        context,
                    }))
                }
                let addScore;
                if (enemy.radius - 10 > 10) {
                    audio.damageTakenAudio.play();
                    addScore = 100;
                    gsap.to(enemy, {
                        radius: enemy.radius -10
                    })
                } else {
                    audio.explodeAudio.play();
                    addScore = 150;
                    enemiesManager.enemies.splice(enemyIndex, 1);
                }
                updateScore(score + addScore);
                createScoreLabel({addScore, position: {x: projectile.x, y: projectile.y}});
                projectileManager.projectiles.splice(index, 1);
                break;
            }
        }
    }
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            deleteParticleIndex.push(index);
        }
    });
    enemiesManager.enemies = enemiesManager.enemies.filter((enemy, index) => !deleteEnemyIndex.includes(index));
    particles = particles.filter((particle, index) => !deleteParticleIndex.includes(index));

    projectileManager.projectiles.forEach((projectile) => {
        projectile.draw();
        projectile.update();
    });
    enemiesManager.enemies.forEach((enemy) => {
        enemy.draw();
    })
    particles.forEach((particle) => {
        particle.draw();
        particle.update();
    })
}


