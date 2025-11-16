// =========================
// PLAYLIST
// =========================
let songs = [
    { name: "Daylight", artist: "David Kushner", src: "./songs/song1.mp3", cover: "./assets/album_picture.jpeg" },
    { name: "Heat Waves", artist: "Glass Animals", src: "./songs/song2.mp3", cover: "./assets/card2img.jpeg" },
    { name: "Under The Influence", artist: "Chris Brown", src: "./songs/song3.mp3", cover: "./assets/card3img.jpeg" }
];

let currentIndex = 0;
let audio = new Audio(songs[currentIndex].src);
let isPlaying = false;
let isRepeat = 0; // 0 = off, 1 = repeat all, 2 = repeat one
let isShuffle = false;

// =========================
// SELECTORS (your HTML <img> buttons)
// =========================
let playBtn = document.querySelector(".player-controls img:nth-child(3)");
let prevBtn = document.querySelector(".player-controls img:nth-child(2)");
let nextBtn = document.querySelector(".player-controls img:nth-child(4)");
let shuffleBtn = document.querySelector(".player-controls img:nth-child(1)");
let repeatBtn = document.querySelector(".player-controls img:nth-child(5)");

let progress = document.querySelector(".progress-bar");
let currTime = document.querySelector(".curr-time");
let totalTime = document.querySelector(".tot-time");

let volSlider = document.querySelector(".volume");
let songName = document.querySelector(".songname");
let artistName = document.querySelector(".writer");
let coverImg = document.querySelector(".album-image");

// =========================
// LOAD SONG
// =========================
function loadSong(index) {
    let s = songs[index];
    audio.src = s.src;
    audio.load();

    songName.innerText = s.name;
    artistName.innerText = s.artist;
    coverImg.src = s.cover;

    audio.addEventListener("loadedmetadata", () => {
        totalTime.innerText = formatTime(audio.duration);
    }, { once: true });

    progress.value = 0;
    currTime.innerText = "00:00";
}

// =========================
// PLAY / PAUSE
// =========================
function playMusic() {
    audio.play();
    isPlaying = true;
    playBtn.style.opacity = "0.7"; // optional visual cue
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playBtn.style.opacity = "1"; // optional visual cue
}

playBtn.addEventListener("click", () => {
    if (isPlaying) pauseMusic();
    else playMusic();
});

// =========================
// NEXT / PREVIOUS
// =========================
function nextSong() {
    if (isShuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentIndex && songs.length > 1);
        currentIndex = nextIndex;
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    loadSong(currentIndex);
    playMusic();
}

function prevSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    playMusic();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// =========================
// SHUFFLE
// =========================
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.opacity = isShuffle ? "0.7" : "1";
});

// =========================
// REPEAT
// =========================
repeatBtn.addEventListener("click", () => {
    isRepeat = (isRepeat + 1) % 3;
    repeatBtn.style.opacity = isRepeat ? "0.7" : "1";
});

// =========================
// AUDIO ENDED
// =========================
audio.addEventListener("ended", () => {
    if (isRepeat === 2) { // repeat one
        audio.currentTime = 0;
        playMusic();
    } else if (isRepeat === 1 && currentIndex === songs.length - 1) { // repeat all
        currentIndex = 0;
        loadSong(currentIndex);
        playMusic();
    } else if (currentIndex < songs.length - 1) {
        nextSong();
    } else {
        pauseMusic();
    }
});

// =========================
// PROGRESS BAR
// =========================
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    let pos = (audio.currentTime / audio.duration) * 100;
    progress.value = pos;
    currTime.innerText = formatTime(audio.currentTime);
});

// Seek
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// =========================
// VOLUME
// =========================
volSlider.value = audio.volume * 100;
volSlider.addEventListener("input", () => {
    audio.volume = volSlider.value / 100;
});

// =========================
// FORMAT TIME
// =========================
function formatTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    if (s < 10) s = "0" + s;
    return `${m}:${s}`;
}

// =========================
// INITIAL LOAD
// =========================
loadSong(currentIndex);
