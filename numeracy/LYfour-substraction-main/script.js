const questions=[
 {total:8,take:4,img:"frog.png",name:"frogs"},
 {total:5,take:2,img:"ball.png",name:"balls"},
 {total:6,take:3,img:"bear.png",name:"bears"},
 {total:3,take:1,img:"house.png",name:"houses"},
 {total:7,take:5,img:"watch.png",name:"watches"},
 {total:7,take:3,img:"frog.png",name:"frogs"},
 {total:6,take:2,img:"ball.png",name:"balls"},
 {total:5,take:1,img:"bear.png",name:"bears"}
];

let quiz=[],index=0,score=0,locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const objects=document.getElementById("objects");
const totalEl=document.getElementById("total");
const takeEl=document.getElementById("takeAway");
const answers=document.getElementById("answers");
const instruction=document.getElementById("instruction");
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

function render(){
  locked=false;
  const q=quiz[index];
  totalEl.textContent=q.total;
  takeEl.textContent=q.take;
  progress.textContent=`${index+1} / 8`;

  instruction.textContent=`There are ${q.total} ${q.name}. Take away ${q.take}. How many are left?`;

  objects.innerHTML="";
  for(let i=0;i<q.total;i++){
    const box=document.createElement("div");
    box.className="object"+(i>=q.total-q.take?" removed":"");

    const im=document.createElement("img");
    im.src=`assets/${q.img}`;
    im.alt=q.name;
    box.appendChild(im);

    if(i>=q.total-q.take){
      const x=document.createElement("div");
      x.className="cross";
      x.textContent="×";
      box.appendChild(x);
    }
    objects.appendChild(box);
  }

  const correct=q.total-q.take;
  const options=new Set([correct]);
  while(options.size<3){
    const n=Math.max(0,Math.min(10,correct+(Math.floor(Math.random()*5)-2)));
    options.add(n);
  }

  answers.innerHTML="";
  shuffle([...options]).forEach(n=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="answer";
    b.textContent=n;
    b.addEventListener("click",()=>checkAnswer(n,b));
    answers.appendChild(b);
  });

  setTimeout(()=>speak(`There are ${q.total} ${q.name}. Take away ${q.take}. How many are left? Tap the correct answer.`),220);
}

function showCorrect(){
  feedback.textContent="✓";
  feedback.style.color="#35a853";
  feedback.classList.remove("hidden");

  confetti.innerHTML="";
  const colors=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"];
  for(let i=0;i<65;i++){
    const p=document.createElement("div");
    p.className="piece";
    p.style.left=Math.random()*100+"vw";
    p.style.animationDelay=Math.random()*.25+"s";
    p.style.background=colors[i%colors.length];
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

function checkAnswer(n,button){
  if(locked)return;
  const q=quiz[index];
  const correct=q.total-q.take;

  if(n===correct){
    locked=true;
    button.classList.add("correct");
    score++;
    scoreEl.textContent="⭐ "+score;
    speak("Correct! Well done!");
    showCorrect();

    setTimeout(()=>{
      index++;
      if(index>=quiz.length) finish();
      else render();
    },950);
  }else{
    button.classList.add("wrong");
    showWrong();
    speak("Try again. Count carefully.");
    setTimeout(()=>button.classList.remove("wrong"),700);
  }
}

function finish(){
  game.classList.add("hidden");
  endScreen.classList.remove("hidden");
  document.getElementById("finalScore").textContent=`You scored ${score} out of 8!`;
  speak(`Great job! You scored ${score} out of 8.`);
}

function start(){
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  game.classList.remove("hidden");
  quiz=shuffle(questions.slice());
  index=0;
  score=0;
  scoreEl.textContent="⭐ 0";
  playMusic();
  render();
}

document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("againBtn").addEventListener("click",start);
document.getElementById("hearBtn").addEventListener("click",()=>{
  if(quiz[index]){
    const q=quiz[index];
    speak(`There are ${q.total} ${q.name}. Take away ${q.take}. How many are left?`);
  }
});

window.addEventListener("load",()=>{
  setTimeout(()=>{
    splash.style.display="none";
    startScreen.classList.remove("hidden");
  },5000);
});