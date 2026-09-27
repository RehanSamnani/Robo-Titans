/* ============================================================
   ROBO TITANS #123 — Web Audio Sci-Fi Sound Synthesizer
   Procedural sound effects generated entirely with Web Audio API.
   No external audio files needed!
   ============================================================ */

(function () {
    let audioCtx = null;
    let sfxEnabled = false;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Toggle global audio
    window.toggleAudio = function () {
        sfxEnabled = !sfxEnabled;
        const icon = document.getElementById('soundIcon');
        const btn = document.getElementById('soundToggle');

        if (sfxEnabled) {
            getAudioContext();
            if (icon) {
                icon.className = 'fa-solid fa-volume-high text-lg text-cyber-cyan';
            }
            if (btn) {
                btn.classList.add('border-cyber-cyan', 'shadow-lg', 'shadow-cyber-cyan/30');
            }
            window.playRobotChirp();
        } else {
            if (icon) {
                icon.className = 'fa-solid fa-volume-xmark text-lg text-gray-400';
            }
            if (btn) {
                btn.classList.remove('border-cyber-cyan', 'shadow-lg', 'shadow-cyber-cyan/30');
            }
        }
    };

    // Generic button click sound
    window.playTechSound = function () {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.13);
    };

    // Cute Robot vocalization / Chirp (Nexie voice!)
    window.playRobotChirp = function () {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + idx * 0.06 + 0.08);

            gain.gain.setValueAtTime(0.14, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.13);
        });
    };

    // Laser scan sound effect
    window.playLaserSound = function () {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    };

    // Thruster booster whoosh (Parkour R-Bot jump)
    window.playThrusterSound = function () {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);
        filter.Q.value = 3.0;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    };

    // Arena celebration chime (cheer button)
    window.playCheerChime = function () {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chords = [440, 554.37, 659.25, 880];
        chords.forEach((f) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ctx.currentTime);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.65);
        });
    };
})();
