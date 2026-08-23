/* =========================
   NUMBER NAMES GAME
   PART 1
========================= */

const questions = [

{
number:9,
displayWord:["n","","n",""],
correctWord:"nine"
},

{
number:21,
displayWord:["t","","e","","t","y","-","o","n",""],
correctWord:"twenty-one"
},

{
number:6,
displayWord:["","i","x"],
correctWord:"six"
},

{
number:27,
displayWord:["t","","e","n","t","y","-","s","e","","e",""],
correctWord:"twenty-seven"
},

{
number:36,
displayWord:["","h","","","t","y","-","","i","x"],
correctWord:"thirty-six"
},

{
number:29,
displayWord:["t","","e","","t","","-","n","","n",""],
correctWord:"twenty-nine"
},

{
number:41,
displayWord:["f","","r","","y","-","o","","e"],
correctWord:"forty-one"
}

];

const letters = [
"e","f","i","j",
"n","o","r","s",
"t","v","w","x",
"y"
];

let currentQuestion = 0;
let score = 0;
let muted = false;
let draggedLetter = "";

const splash =
document.getElementById("splashScreen");

const instruction =
document.getElementById("instructionScreen");

const game =
document.getElementById("gameScreen");

const endScreen =
document.getElementById("endScreen");

const startBtn =
document.getElementById("startBtn");

const speakBtn =
document.getElementById("speakBtn");

const checkBtn =
document.getElementById("checkBtn");

const playAgainBtn =
document.getElementById("playAgainBtn");

const exitBtn =
document.getElementById("exitBtn");

const muteBtn =
document.getElementById("muteBtn");

const bgMusic =
document.getElementById("bgMusic");

const correctSound =
document.getElementById("correctSound");

const wrongSound =
document.getElementById("wrongSound");

/* -----------------------
   SPEECH
----------------------- */

function speak(text){

if(muted) return;

if(!window.speechSynthesis) return;

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.rate = 0.9;

speechSynthesis.speak(speech);

}

function speakInstructions(){

speak(
"Welcome to the Number Names Game. Drag and drop the correct letters in the blanks to form the correct number name."
);

}

/* -----------------------
   SPLASH
----------------------- */

setTimeout(()=>{

splash.classList.remove("active");

instruction.classList.add("active");

speakInstructions();

},5000);

/* -----------------------
   BUTTONS
----------------------- */

speakBtn.addEventListener(
"click",
speakInstructions
);

startBtn.addEventListener(
"click",
()=>{

instruction.classList.remove(
"active"
);

game.classList.add(
"active"
);

bgMusic.volume = 0.3;

bgMusic.play().catch(()=>{});

loadQuestion();

}
);

muteBtn.addEventListener(
"click",
()=>{

muted = !muted;

muteBtn.innerHTML =
muted ? "🔇" : "🔊";

if(muted){

bgMusic.pause();

}
else{

bgMusic.play().catch(()=>{});

}

}
);

/* -----------------------
   LOAD QUESTION
----------------------- */

function loadQuestion(){

const q =
questions[currentQuestion];

document.getElementById(
"numberDisplay"
).innerHTML =
q.number;

document.getElementById(
"feedback"
).innerHTML = "";

const container =
document.getElementById(
"wordContainer"
);

container.innerHTML = "";

q.displayWord.forEach(char=>{

if(char === ""){

const blank =
document.createElement("div");

blank.className =
"blank";

blank.dataset.value =
"";

container.appendChild(
blank
);

}
else{

const fixed =
document.createElement("div");

fixed.className =
"fixed";

fixed.innerHTML =
char;

container.appendChild(
fixed
);

}

});

createLetterBank();

initialiseBlanks();

speak(
"Number " +
q.number +
". Complete the number name."
);

}

/* -----------------------
   LETTER BANK
----------------------- */

function createLetterBank(){

const bank =
document.getElementById(
"letterBank"
);

bank.innerHTML = "";

letters.forEach(letter=>{

const tile =
document.createElement("div");

tile.className =
"letter";

tile.innerHTML =
letter;

tile.draggable = true;

tile.addEventListener(
"dragstart",
dragStart
);

bank.appendChild(
tile
);

});

}

function dragStart(e){

draggedLetter =
e.target.innerHTML;

}

function initialiseBlanks(){

const blanks =
document.querySelectorAll(
".blank"
);

blanks.forEach(blank=>{

blank.addEventListener(
"dragover",
e=>{

e.preventDefault();

}
);

blank.addEventListener(
"drop",
dropLetter
);

});

}

function dropLetter(e){

e.preventDefault();

e.target.innerHTML =
draggedLetter;

e.target.dataset.value =
draggedLetter;

}/* =========================
   PART 2
========================= */

checkBtn.addEventListener(
"click",
checkAnswer
);

function checkAnswer(){

const q =
questions[currentQuestion];

const blanks =
document.querySelectorAll(
".blank"
);

let builtWord = "";

let blankIndex = 0;

q.displayWord.forEach(char=>{

if(char === ""){

builtWord +=
blanks[blankIndex]
.dataset.value || "";

blankIndex++;

}
else{

builtWord += char;

}

});

if(
builtWord ===
q.correctWord
){

correctAnswer();

}
else{

wrongAnswer();

}

}

/* -----------------------
   CORRECT
----------------------- */

function correctAnswer(){

document.getElementById(
"feedback"
).innerHTML =
'<div class="correct">✔ Excellent!</div>';

correctSound.currentTime = 0;

correctSound.play();

if(typeof confetti ===
"function"){

confetti({

particleCount:150,
spread:90,
origin:{y:0.6}

});

}

speak(
"Excellent. That is correct."
);

score++;

document.getElementById(
"score"
).innerHTML =
score;

setTimeout(()=>{

currentQuestion++;

if(
currentQuestion >=
questions.length
){

showEndScreen();

}
else{

loadQuestion();

}

},3000);

}

/* -----------------------
   WRONG
----------------------- */

function wrongAnswer(){

document.getElementById(
"feedback"
).innerHTML =
'<div class="wrong">✖ Try Again</div>';

wrongSound.currentTime = 0;

wrongSound.play();

speak(
"Oops. Try again."
);

}

/* -----------------------
   END SCREEN
----------------------- */

function showEndScreen(){

game.classList.remove(
"active"
);

endScreen.classList.add(
"active"
);

document.getElementById(
"finalScore"
).innerHTML =
"Your Score : " +
score +
" / " +
questions.length;

const stars =
document.getElementById(
"stars"
);

if(score === 7){

stars.innerHTML =
"⭐⭐⭐";

}
else if(score >= 5){

stars.innerHTML =
"⭐⭐";

}
else if(score >= 3){

stars.innerHTML =
"⭐";

}
else{

stars.innerHTML =
"Keep Practicing";

}

speak(
"Congratulations. You completed the game."
);

}

/* -----------------------
   PLAY AGAIN
----------------------- */

playAgainBtn.addEventListener(
"click",
()=>{

location.reload();

}
);

exitBtn.addEventListener(
"click",
()=>{

location.reload();

}
);
