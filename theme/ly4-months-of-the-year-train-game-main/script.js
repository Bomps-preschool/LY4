const questions=[
 {months:["January","February","March"],blank:2,answer:"March",q:"Which month comes after February?"},
 {months:["April","May","June"],blank:1,answer:"May",q:"Which month comes between April and June?"},
 {months:["July","August","September"],blank:0,answer:"July",q:"Which month comes before August?"},
 {months:["October","November","December"],blank:2,answer:"December",q:"Which month comes after November?"},
 {months:["January","February","March"],blank:1,answer:"February",q:"Which month comes between January and March?"},
 {months:["March","April","May"],blank:0,answer:"March",q:"Which month comes before April?"},
 {months:["May","June","July"],blank:2,answer:"July",q:"Which month comes after June?"},
 {months:["June","July","August"],blank:1,answer:"July",q:"Which month comes between June and August?"},
 {months:["August","September","October"],blank:0,answer:"August",q:"Which month comes before September?"},
 {months:["September","October","November"],blank:2,answer:"November",q:"Which month comes after October?"},
 {months:["October","November","December"],blank:1,answer:"November",q:"Which month comes between October and December?"},
 {months:["November","December","January"],blank:0,answer:"November",q:"Which month comes before December?"}
];

const allMonths=[
 "January","February","March","April","May","June",
 "July","August","September","October","November","December"
];

let quiz=[],index=0,score=0,locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const instruction=document.getElementById("instruction");
const answers=document.getElementById("answers");
const progress=document.getElementById("progress");
const scoreEl=document.getElementById("score");
const feedback=document.getElementById("feedback");
const confetti=document.getElementById("confetti");
const music=document.getElementById("music");
const correctSound=document.getElementById("correctSound");
const wrongSound=document.getElementById("wrongSound");

function shuffle(a){
 for(let i=a.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}

function playMusic(){
 music.volume=.15;
 const p=music.play();
 if(p)p.catch(()=>{});
}

function setCoach(id,text){
 document.getElementById(id).textContent=text||"";
}

function render(){
 locked=false;
 const q=quiz[index];

 setCoach("coach1",q.blank===0?"":q.months[0]);
 setCoach("coach2",q.blank===1?"":q.months[1]);
 setCoach("coach3",q.blank===2?"":q.months[2]);

 instruction.textContent=q.q;
 progress.textContent=`${index+1} / 12`;
 answers.innerHTML="";

 shuffle(allMonths.slice()).forEach(month=>{
   const b=document.createElement("button");
   b.type="button";
   b.className="answer";
   b.textContent=month;
   b.addEventListener("click",()=>checkAnswer(month,b));
   answers.appendChild(b);
 });

 setTimeout(()=>speak(`${q.q} Tap the missing month.`),250);
}

function showCorrect(){
 feedback.textContent="✓";
 feedback.style.color="#34a853";
 feedback.classList.remove("hidden");

 confetti.innerHTML="";
 for(let i=0;i<60;i++){
   const p=document.createElement("div");
   p.className="piece";
   p.style.left=Math.random()*100+"vw";
   p.style.animationDelay=Math.random()*.25+"s";
   p.style.background=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"][i%5];
   confetti.appendChild(p);
 }
 correctSound.currentTime=0;
 correctSound.play().catch(()=>{});

 setTimeout(()=>{
   feedback.classList.add("hidden");
   confetti.innerHTML="";
 },900);
}

function showWrong(){
 feedback.textContent="✕";
 feedback.style.color="#e53935";
 feedback.classList.remove("hidden");
 wrongSound.currentTime=0;
 wrongSound.play().catch(()=>{});
 setTimeout(()=>feedback.classList.add("hidden"),800);
}

function checkAnswer(month,button){
 if(locked)return;

 const q=quiz[index];

 if(month===q.answer){
   locked=true;
   button.classList.add("correct");
   score++;
   scoreEl.textContent="⭐ "+score;
   speak("Correct! Well done.");
   showCorrect();

   setTimeout(()=>{
     index++;
     if(index>=12) finish();
     else render();
   },950);
 }else{
   button.classList.add("wrong");
   showWrong();
   speak("Try again. Look at the train.");
   setTimeout(()=>button.classList.remove("wrong"),650);
 }
}

function finish(){
 game.classList.add("hidden");
 endScreen.classList.remove("hidden");
 document.getElementById("finalScore").textContent=`You scored ${score} out of 12!`;
 speak(`Great job! You scored ${score} out of 12.`);
}

function start(){
 startScreen.classList.add("hidden");
 endScreen.classList.add("hidden");
 game.classList.remove("hidden");
 playMusic();
 quiz=shuffle(questions.slice());
 index=0;
 score=0;
 scoreEl.textContent="⭐ 0";
 render();
}

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("againBtn").addEventListener("click",start);
document.getElementById("hearBtn").addEventListener("click",()=>{
 if(quiz[index]) speak(`${quiz[index].q} Tap the missing month.`);
});

window.addEventListener("load",()=>{
 setTimeout(()=>{
   splash.style.display="none";
   startScreen.classList.remove("hidden");
 },5000);
});