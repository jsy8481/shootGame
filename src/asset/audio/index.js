import basicShootNoise from "@audio/Basic_shoot_noise.wav";
import expload from "@audio/Explode.wav"
import damageTaken from "@audio/Damage_taken.wav";
import death from "@audio/Death.wav";
import powerUp from "@audio/Powerup_noise.wav";
import select from "@audio/Select.wav";
import hyper from "@audio/Hyper.wav";

const damageTakenAudio = new Howl({
    src: damageTaken,
    volume: 0.08,
});
const explodeAudio = new Howl({
    src: expload,
    volume: 0.3,
})

const shootAudio = new Howl({
    src: basicShootNoise,
    volume: 0.05,
});

const deathAudio = new Howl({
    src: death,
    volume: 0.08,
});

const powerUpAudio = new Howl({
    src: powerUp,
    volume: 0.05,
})

const selectAudio = new Howl({
    src: select,
    volume: 0.3,
})

const backgroundAudio = new Howl({
    src: hyper,
    volume: 0.1,
    loop: true,
})

export const audio = {
    damageTakenAudio,
    explodeAudio,
    shootAudio,
    deathAudio,
    powerUpAudio,
    selectAudio,
    backgroundAudio,
}

export function startGameBackGroundAudio() {
    if (backgroundAudio.playing()) {
        return;
    }
    backgroundAudio.play();
}

export function stopGameBackGroundAudio() {
    if (backgroundAudio.playing()) {
        backgroundAudio.stop();
    }
}

export function muteAllAudio() {
    for (let audioKey in audio) {
        audio[audioKey].mute(true);
        console.log(audio[audioKey]);
    }
    backgroundAudio.stop();
}

export function unmuteAllAudio() {
    for (let audioKey in audio) {
        audio[audioKey].mute(false);
    }
}

export default {
    audio,
    muteAllAudio,
    unmuteAllAudio,
    startGameBackGroundAudio,
    stopGameBackGroundAudio,
}
