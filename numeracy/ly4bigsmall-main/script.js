/* =========================================
   BIG OR SMALL GAME
   SENIOR KG
   ========================================= */


/* =========================================
   QUESTIONS
   ========================================= */

const rounds = [

    {
        item: "boy",
        file: "boy.svg",
        target: "big"
    },

    {
        item: "umbrella",
        file: "umbrella.svg",
        target: "small"
    },

    {
        item: "bird",
        file: "bird.svg",
        target: "big"
    },

    {
        item: "ball",
        file: "ball.svg",
        target: "small"
    },

    {
        item: "flower",
        file: "flower.svg",
        target: "big"
    },

    {
        item: "cat",
        file: "cat.svg",
        target: "small"
    },

    {
        item: "kite",
        file: "kite.svg",
        target: "big"
    },

    {
        item: "apple",
        file: "apple.svg",
        target: "small"
    },

    {
        item: "car",
        file: "car.svg",
        target: "big"
    },

    {
        item: "butterfly",
        file: "butterfly.svg",
        target: "small"
    }

];


/* =========================================
   VARIABLES
   ========================================= */

let currentQuestion = 0;

let score = 0;

let questionLocked = false;


/* =========================================
   ELEMENTS
   ========================================= */

const splash =
    document.getElementById("splash");

const startScreen =
    document.getElementById("startScreen");

const game =
    document.getElementById("game");

const endScreen =
    document.getElementById("endScreen");

const startBtn =
    document.getElementById("startBtn");

const againBtn =
    document.getElementById("againBtn");

const hearBtn =
    document.getElementById("hearBtn");

const pair =
    document.getElementById("pair");

const instruction =
    document.getElementById("instruction");

const progress =
    document.getElementById("progress");

const scoreDisplay =
    document.getElementById("score");

const feedback =
    document.getElementById("feedback");

const confetti =
    document.getElementById("confetti");

const finalScore =
    document.getElementById("finalScore");

const music =
    document.getElementById("music");

const correctSound =
    document.getElementById("correctSound");

const wrongSound =
    document.getElementById("wrongSound");


/* =========================================
   SAFE SPEECH FUNCTION
   ========================================= */

function speakText(text) {

    if (
        typeof speak === "function"
    ) {

        speak(text);

        return;

    }


    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

        const message =
            new SpeechSynthesisUtterance(text);

        message.rate = 0.9;

        message.pitch = 1.1;

        window.speechSynthesis.speak(
            message
        );

    }

}


/* =========================================
   START MUSIC
   ========================================= */

function startMusic() {

    music.volume = 0.15;

    const promise =
        music.play();

    if (promise) {

        promise.catch(
            function() {}
        );

    }

}


/* =========================================
   SHOW QUESTION
   ========================================= */

function showQuestion() {

    questionLocked = false;


    const question =
        rounds[currentQuestion];


    /*
       IMPORTANT:
       The instruction now says
       "Tap on..." instead of "Circle..."
    */

    instruction.textContent =
        "Tap on the " +
        question.target +
        " " +
        question.item +
        ".";


    progress.textContent =
        (currentQuestion + 1) +
        " / 10";


    pair.innerHTML = "";


    /*
       Randomly put BIG and SMALL
       on left/right.
    */

    let sizes;


    if (
        Math.random() < 0.5
    ) {

        sizes = [
            "big",
            "small"
        ];

    } else {

        sizes = [
            "small",
            "big"
        ];

    }


    sizes.forEach(
        function(size) {


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "choice " + size;


            button.dataset.size =
                size;


            button.setAttribute(
                "aria-label",
                size + " " + question.item
            );


            button.innerHTML =

                '<img src="assets/' +
                question.file +
                '" alt="' +
                size +
                ' ' +
                question.item +
                '">' +

                '<span class="label">' +
                size +
                '</span>';


            /*
               POINTERUP works with:

               • Mouse
               • Android touch
               • iPhone/iPad touch
               • Tablet touch
            */

            button.addEventListener(
                "pointerup",
                function(event) {

                    event.preventDefault();

                    checkAnswer(
                        size,
                        button
                    );

                }
            );


            pair.appendChild(
                button
            );

        }
    );


    /*
       VOICE INSTRUCTION
    */

    setTimeout(
        function() {

            speakText(
                "Tap on the " +
                question.target +
                " " +
                question.item + "."
            );

        },
        250
    );

}


/* =========================================
   CHECK ANSWER
   ========================================= */

function checkAnswer(
    selectedSize,
    selectedButton
) {


    /*
       Do nothing if the child has
       already answered correctly.
    */

    if (questionLocked) {

        return;

    }


    const question =
        rounds[currentQuestion];


    /* =====================================
       CORRECT
       ===================================== */

    if (
        selectedSize ===
        question.target
    ) {


        questionLocked = true;


        score++;


        scoreDisplay.textContent =
            "⭐ " + score;


        selectedButton.classList.add(
            "selected"
        );


        showCorrect();


        speakText(
            "Correct! Well done!"
        );


        /*
           Move to next question
           after feedback.
        */

        setTimeout(
            function() {


                currentQuestion++;


                if (
                    currentQuestion >=
                    rounds.length
                ) {

                    finishGame();

                } else {

                    showQuestion();

                }

            },
            1100
        );

    }


    /* =====================================
       WRONG
       ===================================== */

    else {


        /*
           The game DOES NOT move ahead.
        */

        selectedButton.classList.add(
            "wrong"
        );


        showWrong();


        speakText(
            "Try again. Look carefully."
        );


        setTimeout(
            function() {

                selectedButton.classList.remove(
                    "wrong"
                );

            },
            800
        );

    }

}


/* =========================================
   CORRECT FEEDBACK
   ========================================= */

function showCorrect() {


    feedback.textContent =
        "✓";


    feedback.classList.remove(
        "hidden"
    );


    correctSound.currentTime =
        0;


    correctSound
        .play()
        .catch(
            function() {}
        );


    createConfetti();


    setTimeout(
        function() {

            feedback.classList.add(
                "hidden"
            );

        },
        900
    );

}


/* =========================================
   WRONG FEEDBACK
   ========================================= */

function showWrong() {


    feedback.textContent =
        "✕";


    feedback.classList.remove(
        "hidden"
    );


    wrongSound.currentTime =
        0;


    wrongSound
        .play()
        .catch(
            function() {}
        );


    setTimeout(
        function() {

            feedback.classList.add(
                "hidden"
            );

        },
        800
    );

}


/* =========================================
   CONFETTI
   ========================================= */

function createConfetti() {


    confetti.innerHTML = "";


    const colors = [

        "#ff6b6b",
        "#ffd43b",
        "#69db7c",
        "#4dabf7",
        "#cc5de8"

    ];


    for (
        let i = 0;
        i < 70;
        i++
    ) {


        const piece =
            document.createElement(
                "div"
            );


        piece.className =
            "piece";


        piece.style.left =
            Math.random() * 100 +
            "vw";


        piece.style.backgroundColor =
            colors[
                i % colors.length
            ];


        piece.style.animationDelay =
            Math.random() * 0.2 +
            "s";


        confetti.appendChild(
            piece
        );

    }


    setTimeout(
        function() {

            confetti.innerHTML = "";

        },
        1400
    );

}


/* =========================================
   START GAME
   ========================================= */

function startGame() {


    currentQuestion = 0;

    score = 0;

    questionLocked = false;


    scoreDisplay.textContent =
        "⭐ 0";


    startScreen.classList.add(
        "hidden"
    );


    endScreen.classList.add(
        "hidden"
    );


    game.classList.remove(
        "hidden"
    );


    startMusic();


    showQuestion();

}


/* =========================================
   FINISH GAME
   ========================================= */

function finishGame() {


    game.classList.add(
        "hidden"
    );


    endScreen.classList.remove(
        "hidden"
    );


    finalScore.textContent =
        "You scored " +
        score +
        " out of 10!";


    speakText(
        "Great job! You scored " +
        score +
        " out of 10."
    );

}


/* =========================================
   START BUTTON
   ========================================= */

startBtn.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* =========================================
   PLAY AGAIN
   ========================================= */

againBtn.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* =========================================
   HEAR BUTTON
   ========================================= */

hearBtn.addEventListener(
    "click",
    function() {


        const question =
            rounds[currentQuestion];


        speakText(
            "Tap on the " +
            question.target +
            " " +
            question.item + "."
        );

    }
);


/* =========================================
   5-SECOND INNOVINE SPLASH
   ========================================= */

window.addEventListener(
    "load",
    function() {


        startScreen.classList.add(
            "hidden"
        );


        setTimeout(
            function() {


                splash.style.display =
                    "none";


                startScreen.classList.remove(
                    "hidden"
                );


            },
            5000
        );

    }
);
