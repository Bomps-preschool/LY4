// ======================================
// GAME OBJECTS
// ======================================

const objects = [
    { name: "House", image: "assets/house.png", shape: "pentagon" },
    { name: "Honey", image: "assets/honey.png", shape: "hexagon" },
    { name: "Stop Sign", image: "assets/stop.png", shape: "octagon" },

    { name: "Gift", image: "assets/gift.png", shape: "pentagon" },
    { name: "Nut", image: "assets/nut.png", shape: "hexagon" },
    { name: "Road Marker", image: "assets/roadmarker.png", shape: "octagon" },

    { name: "Badge", image: "assets/badge.png", shape: "pentagon" },
    { name: "Pencil", image: "assets/pencil.png", shape: "hexagon" },
    { name: "Clock", image: "assets/clock.png", shape: "octagon" },

    { name: "Tile", image: "assets/tile.png", shape: "hexagon" },
    { name: "Spectacles", image: "assets/specs.png", shape: "octagon" },

    { name: "Go Sign", image: "assets/go.png", shape: "hexagon" }
];

// ======================================
// ELEMENTS
// ======================================

const splashScreen = document.getElementById("splashScreen");
const instructionScreen = document.getElementById("instructionScreen");
const gameScreen = document.getElementById("gameScreen");
const completionScreen = document.getElementById("completionScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");

const currentObject = document.getElementById("currentObject");

const scoreSpan = document.getElementById("score");
const totalScoreSpan = document.getElementById("totalScore");

const tick = document.getElementById("tick");
const cross = document.getElementById("cross");

const finalScore = document.getElementById("finalScore");
const percentage = document.getElementById("percentage");
const stars = document.getElementById("stars");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const bgMusic = document.getElementById("bgMusic");

const dropzones = document.querySelectorAll(".dropzone");

// ======================================
// VARIABLES
// ======================================

let score = 0;
let currentIndex = 0;
let currentItem = null;

totalScoreSpan.textContent = objects.length;

// ======================================
// SPEECH
// ======================================

function speak(text) {

    if (!window.speechSynthesis) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
}

// ======================================
// SPLASH SCREEN
// ======================================

window.onload = function () {

    setTimeout(() => {

        splashScreen.classList.add("hidden");

        instructionScreen.classList.remove("hidden");

        speak(
            "Welcome to Shape Match Adventure. Drag the picture to the correct shape."
        );

    }, 5000);

};

// ======================================
// START GAME
// ======================================

startBtn.addEventListener("click", () => {

    instructionScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    bgMusic.volume = 0.3;

    bgMusic.play().catch(() => {});

    loadObject();

});

// ======================================
// LOAD OBJECT
// ======================================

function loadObject() {

    if (currentIndex >= objects.length) {

        finishGame();
        return;
    }

    currentItem = objects[currentIndex];

    currentObject.src = currentItem.image;

    currentObject.alt = currentItem.name;

    currentObject.draggable = true;

    speak(`Drag the ${currentItem.name}`);
}

// ======================================
// DESKTOP DRAG
// ======================================

currentObject.addEventListener("dragstart", (e) => {

    e.dataTransfer.setData(
        "shape",
        currentItem.shape
    );

});

dropzones.forEach(zone => {

    zone.addEventListener("dragover", (e) => {

        e.preventDefault();

    });

    zone.addEventListener("drop", (e) => {

        e.preventDefault();

        checkAnswer(
            zone.dataset.shape
        );

    });

});

// ======================================
// MOBILE TOUCH SUPPORT
// ======================================

let activeClone = null;

currentObject.addEventListener("touchstart", touchStart);

function touchStart(e) {

    const touch = e.touches[0];

    activeClone =
        currentObject.cloneNode(true);

    activeClone.style.position = "fixed";
    activeClone.style.width = "120px";
    activeClone.style.pointerEvents = "none";
    activeClone.style.zIndex = "9999";

    document.body.appendChild(activeClone);

    moveClone(touch);
}

document.addEventListener("touchmove", e => {

    if (!activeClone) return;

    moveClone(e.touches[0]);

});

document.addEventListener("touchend", e => {

    if (!activeClone) return;

    const touch =
        e.changedTouches[0];

    dropzones.forEach(zone => {

        const rect =
            zone.getBoundingClientRect();

        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {

            checkAnswer(
                zone.dataset.shape
            );

        }

    });

    activeClone.remove();

    activeClone = null;

});

function moveClone(touch) {

    activeClone.style.left =
        (touch.clientX - 60) + "px";

    activeClone.style.top =
        (touch.clientY - 60) + "px";
}

// ======================================
// CHECK ANSWER
// ======================================

function checkAnswer(selectedShape) {

    if (
        selectedShape === currentItem.shape
    ) {

        correctAnswer();

    } else {

        wrongAnswer();

    }
}

// ======================================
// CORRECT
// ======================================

function correctAnswer() {

    correctSound.currentTime = 0;
    correctSound.play();

    speak("Great job");

    score++;

    scoreSpan.textContent = score;

    tick.classList.remove("hidden");

    setTimeout(() => {

        tick.classList.add("hidden");

        currentIndex++;

        loadObject();

    }, 1200);

}

// ======================================
// WRONG
// ======================================

function wrongAnswer() {

    wrongSound.currentTime = 0;
    wrongSound.play();

    speak("Try again");

    cross.classList.remove("hidden");

    tryAgainBtn.classList.remove("hidden");

}

// ======================================
// TRY AGAIN
// ======================================

tryAgainBtn.addEventListener("click", () => {

    cross.classList.add("hidden");

    tryAgainBtn.classList.add("hidden");

    speak(
        `Drag the ${currentItem.name}`
    );

});

// ======================================
// FINISH GAME
// ======================================

function finishGame() {

    bgMusic.pause();

    gameScreen.classList.add("hidden");

    completionScreen.classList.remove("hidden");

    const percent =
        Math.round(
            (score / objects.length) * 100
        );

    finalScore.textContent =
        `Score: ${score} / ${objects.length}`;

    percentage.textContent =
        `${percent}%`;

    if (percent === 100) {

        stars.innerHTML = "⭐⭐⭐";

    } else if (percent >= 80) {

        stars.innerHTML = "⭐⭐";

    } else {

        stars.innerHTML = "⭐";

    }

    speak(
        "Congratulations. You completed the game."
    );

}

// ======================================
// PLAY AGAIN
// ======================================

playAgainBtn.addEventListener("click", () => {

    score = 0;
    currentIndex = 0;

    scoreSpan.textContent = "0";

    completionScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    bgMusic.currentTime = 0;

    bgMusic.play().catch(() => {});

    loadObject();

});
