class SoundManager {
    constructor() {
        this.playing = [];
    }

    play(sound, volume) {
        let play = false;
        if (this.playing.includes(sound)) {
            if (!sounds[sound].isPlaying()) {
                this.playing.splice(this.playing.indexOf(sound), 1);
                play = true;
            }
        } else {
            play = true;
        }
        if (play) {
            sounds[sound].setVolume(volume);
            sounds[sound].play();
            this.playing.push(sound);
        }
    }
}