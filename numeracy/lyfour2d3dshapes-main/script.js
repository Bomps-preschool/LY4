const items=[
 {name:"cube",dim:"3D",img:"cube.png"},
 {name:"cylinder",dim:"3D",img:"cylinder.png"},
 {name:"rectangle",dim:"2D",img:"rectangle.png"},
 {name:"octagon",dim:"2D",img:"octagon.png"},
 {name:"pyramid",dim:"3D",img:"pyramid.png"},
 {name:"hexagon",dim:"2D",img:"hexagon.png"},
 {name:"pentagon",dim:"2D",img:"pentagon.png"},
 {name:"cone",dim:"3D",img:"cone.png"},
 {name:"sphere",dim:"3D",img:"sphere.png"},
 {name:"triangle",dim:"2D",img:"triangle.png"}
];

let quiz=[],index=0,score=0,locked=false;
const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const shapeImage=document.getElementById("shapeImage");
const shapeName=document.getElementById("shapeName");
const instruction=document.getElementById("instruction");
const progress=document.getElementById("progress");
const scoreEl=document.getElementById("score");
const feedback=document.getElementById("feedback");
const confetti=document.getElementById("confetti");
const music=document.getElementById("music");
const correctSound=document.getElementById("correctSound");
const wrongSound=document.getElementById("wrongSound");

function shuffle(a){
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
function playMusic(){music.volume=.15;const p=music.play();if(p)p.catch(()=>{})}

function render(){
 locked=false;
 const q=quiz[index];
 shapeImage.src=`assets/${q.img}`;
 shapeImage.alt=q.name;
 shapeName.textContent=q.name;
 instruction.textContent=`Is the ${q.name} 2D or 3D?`;
 progress.textContent=`${index+1} / 10`;

 setTimeout(()=>speak(`Look at the ${q.name}. Is it 2D or 3D? Tap your answer.`),220);
}

function showCorrect(){
 feedback.textContent="✓";feedback.style.color="#35a853";feedback.classList.remove("hidden");
 confetti.innerHTML="";
 const colors=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"];
 for(let i=0;i<65;i++){
  const p=document.createElement("div");p.className="piece";
  p.style.left=Math.random()*100+"vw";p.style.animationDelay=Math.random()*.25+"s";
  p.style.background=colors[i%colors.length];confetti.appendChild(p);
 }
 correctSound.currentTime=0;correctSound.play().catch(()=>{});
 setTimeout(()=>{feedback.classList.add("hidden");confetti.innerHTML=""},900);
}
function showWrong(){
 feedback.textContent="✕";feedback.style.color="#e53935";feedback.classList.remove("hidden");
 wrongSound.currentTime=0;wrongSound.play().catch(()=>{});
 setTimeout(()=>feedback.classList.add("hidden"),800);
}
function checkAnswer(answer,button){
 if(locked)return;
 const q=quiz[index];
 if(answer===q.dim){
  locked=true;score++;scoreEl.textContent="⭐ "+score;
  button.classList.add("correct");speak("Correct! Well done!");showCorrect();
  setTimeout(()=>{index++;if(index>=quiz.length)finish();else render()},950);
 }else{
  button.classList.add("wrong");showWrong();speak("Try again. Look at the shape.");
  setTimeout(()=>button.classList.remove("wrong"),700);
 }
}
function finish(){
 game.classList.add("hidden");endScreen.classList.remove("hidden");
 document.getElementById("finalScore").textContent=`You scored ${score} out of 10!`;
 speak(`Great job! You scored ${score} out of 10.`);
}
function start(){
 startScreen.classList.add("hidden");endScreen.classList.add("hidden");game.classList.remove("hidden");
 quiz=shuffle(items.slice());index=0;score=0;scoreEl.textContent="⭐ 0";playMusic();render();
}
document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("againBtn").addEventListener("click",start);
document.getElementById("hearBtn").addEventListener("click",()=>{
 if(quiz[index])speak(`Look at the ${quiz[index].name}. Is it 2D or 3D? Tap your answer.`);
});
document.querySelectorAll(".sortBtn").forEach(btn=>{
 btn.addEventListener("pointerup",e=>{e.preventDefault();checkAnswer(btn.dataset.answer,btn)});
});
window.addEventListener("load",()=>setTimeout(()=>{splash.style.display="none";startScreen.classList.remove("hidden")},5000));
