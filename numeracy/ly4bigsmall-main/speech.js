function speak(text){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-IN";u.rate=.86;u.pitch=1.05;
  window.speechSynthesis.speak(u);
}