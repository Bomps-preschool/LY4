/*==================================================
MATCH ANIMAL TO SOUND
Author : ChatGPT
==================================================*/

/*=========================
ANIMAL DATA
=========================*/

const animals = [

{
id:"cow",
name:"Cow",
image:"assets/cow.jpg",
sound:"assets/moo.mp3.mp3"
},

{
id:"dog",
name:"Dog",
image:"assets/dog.jpg",
sound:"assets/woof.mp3.mp3"
},

{
id:"cat",
name:"Cat",
image:"assets/cat.jpg",
sound:"assets/meow.mp3.mp3"
},

{
id:"horse",
name:"Horse",
image:"assets/horse.jpg",
sound:"assets/neigh.mp3.mp3"
},

{
id:"pig",
name:"Pig",
image:"assets/pig.jpg",
sound:"assets/oink.mp3.mp3"
},

{
id:"lion",
name:"Lion",
image:"assets/lion.jpg",
sound:"assets/roar.mp3.mp3"
},

{
id:"snake",
name:"Snake",
image:"assets/snake.jpg",
sound:"assets/hiss.mp3.mp3"
},

{
id:"tiger",
name:"Tiger",
image:"assets/tiger.jpg",
sound:"assets/growl.mp3.mp3"
}

];


/*=========================
GLOBAL VARIABLES
=========================*/

let selectedSound = null;

let score = 0;

let matched = 0;


/*=========================
GET HTML ELEMENTS
=========================*/

const logoScreen = document.getElementById("logoScreen");

const instructionScreen =
document.getElementById("instructionScreen");

const gameScreen =
document.getElementById("gameScreen");

const endScreen =
document.getElementById("endScreen");

const animalColumn =
document.getElementById("animalColumn");

const soundColumn =
document.getElementById("soundColumn");

const scoreLabel =
document.getElementById("score");

const finalScore =
document.getElementById("finalScore");

const message =
document.getElementById("message");

const correctAudio =
document.getElementById("correctAudio");

const wrongAudio =
document.getElementById("wrongAudio");


/*=========================
PRELOAD AUDIO
=========================*/

animals.forEach(animal=>{

const audio=new Audio(animal.sound);

audio.preload="auto";

});

correctAudio.load();

wrongAudio.load();


/*=========================
SPEECH
=========================*/

function speak(text){

if(!("speechSynthesis" in window))
return;

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.rate=.9;

speech.pitch=1.1;

speech.volume=1;

speechSynthesis.speak(speech);

}


/*=========================
SHUFFLE
=========================*/

function shuffle(array){

let arr=[...array];

for(let i=arr.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[arr[i],arr[j]]=[arr[j],arr[i]];

}

return arr;

}


/*=========================
WINDOW LOAD
=========================*/

window.onload=function(){

logoScreen.style.display="flex";

instructionScreen.style.display="none";

gameScreen.style.display="none";

endScreen.style.display="none";


setTimeout(function(){

logoScreen.style.display="none";

instructionScreen.style.display="flex";

speak(

"Welcome. Match the animal to its sound. Click Start Game."

);

},5000);

};


/*=========================
START BUTTON
=========================*/

document
.getElementById("startBtn")
.addEventListener("click",function(){

instructionScreen.style.display="none";

gameScreen.style.display="flex";

createGame();

speak(

"Click a sound card. Listen carefully. Then click the matching animal."

);

});/*==================================================
CREATE GAME BOARD
==================================================*/

function createGame(){

selectedSound=null;

animalColumn.innerHTML="";
soundColumn.innerHTML="";

scoreLabel.textContent=score;

/*=========================
CREATE ANIMAL CARDS
=========================*/

animals.forEach(animal=>{

const card=document.createElement("div");

card.className="animalCard";

card.dataset.id=animal.id;

card.innerHTML=`
<img src="${animal.image}" alt="${animal.name}">
<span>${animal.name}</span>
`;

card.addEventListener("click",function(){

selectAnimal(card);

});

animalColumn.appendChild(card);

});


/*=========================
CREATE SHUFFLED SOUND CARDS
=========================*/

const shuffled=shuffle(animals);

shuffled.forEach(animal=>{

const card=document.createElement("div");

card.className="soundCard";

card.dataset.id=animal.id;

card.innerHTML="🔊 Sound";

card.addEventListener("click",function(){

document.querySelectorAll(".soundCard")
.forEach(c=>c.classList.remove("selected"));

card.classList.add("selected");

selectedSound=animal.id;

playSound(animal.sound);

resetVoiceReminder();

});

soundColumn.appendChild(card);

});

}


/*==================================================
PLAY SOUND
==================================================*/

function playSound(soundFile){

const audio=new Audio(soundFile);

audio.currentTime=0;

audio.play().catch(function(){

console.log("Audio playback blocked.");

});

}


/*==================================================
VOICE REMINDER
==================================================*/

let reminderTimer;

function resetVoiceReminder(){

clearTimeout(reminderTimer);

reminderTimer=setTimeout(function(){

if(matched<animals.length){

speak(
"Now tap the matching animal."
);

}

},8000);

}


/*==================================================
SHOW MESSAGE
==================================================*/

function showMessage(text,color){

message.innerHTML=text;

message.style.color=color;

message.style.display="block";

setTimeout(function(){

message.style.display="none";

},1800);

}


/*==================================================
STAR ANIMATION
==================================================*/

function createStars(){

for(let i=0;i<20;i++){

const star=document.createElement("div");

star.className="star";

star.innerHTML="⭐";

star.style.left=Math.random()*100+"vw";

star.style.top="-40px";

star.style.animationDuration=
(1+Math.random()*2)+"s";

document.body.appendChild(star);

setTimeout(function(){

star.remove();

},2500);

}

}/*==================================================
PART 2A
MATCHING LOGIC
==================================================*/

function selectAnimal(card){

// Child must click a sound first
if(selectedSound===null){

showMessage("🔊 Click a sound first!","#ff5722");

speak("Click a sound card first.");

return;

}

const animalID=card.dataset.id;

/*==============================
CORRECT ANSWER
==============================*/

if(animalID===selectedSound){

correctAudio.currentTime=0;

correctAudio.play().catch(()=>{});

card.classList.add("correct");

/* Disable matching sound card */

document.querySelectorAll(".soundCard").forEach(sound=>{

if(sound.dataset.id===animalID){

sound.classList.add("correct");

sound.style.pointerEvents="none";

sound.classList.remove("selected");

}

});

/* Disable animal */

card.style.pointerEvents="none";

/* Celebration */

createStars();

showMessage("⭐ ⭐ ⭐<br>👍 Great!","green");

speak("Excellent!");

score++;

matched++;

scoreLabel.textContent=score;

/* Reset */

selectedSound=null;

/* Finished? */

if(matched===animals.length){

setTimeout(function(){

endGame();

},1500);

}

}

/*==============================
WRONG ANSWER
==============================*/

else{

wrongAudio.currentTime=0;

wrongAudio.play().catch(()=>{});

showMessage("❌ Try Again","red");

speak("Try again.");

document.querySelectorAll(".soundCard").forEach(card=>{

card.classList.remove("selected");

});

selectedSound=null;

}

}


/*==================================================
UPDATE SCORE
==================================================*/

function updateScore(){

scoreLabel.textContent=score;

}


/*==================================================
RESET GAME SELECTION
==================================================*/

function clearSelection(){

selectedSound=null;

document.querySelectorAll(".soundCard").forEach(card=>{

card.classList.remove("selected");

});

}/*==================================================
PART 2B
END GAME & CONFETTI
==================================================*/

function endGame(){

gameScreen.style.display="none";

endScreen.style.display="flex";

finalScore.innerHTML=
"🏆 Your Score : "+score+" / "+animals.length;

speak(
"Congratulations! You matched all the animals. Your score is "
+score+
" out of "+
animals.length+
". Great job!"
);

createConfetti();

}

/*==================================================
CONFETTI ANIMATION
==================================================*/

function createConfetti(){

const colors=[
"#ff0000",
"#00ff00",
"#0000ff",
"#ffff00",
"#ff00ff",
"#00ffff",
"#ff9800"
];

for(let i=0;i<120;i++){

const piece=document.createElement("div");

piece.style.position="fixed";

piece.style.width="10px";
piece.style.height="10px";

piece.style.background=
colors[Math.floor(Math.random()*colors.length)];

piece.style.left=Math.random()*100+"vw";

piece.style.top="-20px";

piece.style.opacity="0.9";

piece.style.borderRadius="50%";

piece.style.pointerEvents="none";

piece.style.zIndex="9999";

document.body.appendChild(piece);

const x=(Math.random()*300)-150;
const y=window.innerHeight+100;
const rotate=Math.random()*1080;

piece.animate(
[
{
transform:"translate(0,0) rotate(0deg)",
opacity:1
},
{
transform:`translate(${x}px,${y}px) rotate(${rotate}deg)`,
opacity:0
}
],
{
duration:2500+Math.random()*1500,
easing:"ease-out"
}
);

setTimeout(()=>{
piece.remove();
},4000);

}

}

/*==================================================
PLAY AGAIN
==================================================*/

function playAgain(){

score=0;
matched=0;
selectedSound=null;

animalColumn.innerHTML="";
soundColumn.innerHTML="";

scoreLabel.textContent="0";

endScreen.style.display="none";

gameScreen.style.display="flex";

createGame();

speak(
"Let's play again. Click a sound card and then click the matching animal."
);

}

/*==================================================
PLAY AGAIN BUTTON
==================================================*/

const playAgainButton=document.querySelector("#endScreen button");

if(playAgainButton){

playAgainButton.onclick=playAgain;

}

/*==================================================
PREVENT IMAGE DRAGGING
==================================================*/

document.addEventListener("dragstart",function(e){

e.preventDefault();

});

/*==================================================
TOUCH SUPPORT
==================================================*/

document.addEventListener("touchstart",function(){},{passive:true});

/*==================================================
KEEP SCORE DISPLAY UPDATED
==================================================*/

updateScore();

/*==================================================
READY
==================================================*/

console.log("Match Animal to Sound Game Loaded Successfully");
