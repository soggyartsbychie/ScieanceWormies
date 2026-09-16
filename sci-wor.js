const scores = { t1:0, t2:0 };

function toggleDrawer(open){
  document.getElementById('drawer').classList.toggle('open', open);
  document.getElementById('overlay').classList.toggle('show', open);
}

function toggleTopic(headBtn){
  headBtn.nextElementSibling.classList.toggle('show');
}

function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const target = document.getElementById('view-'+id);
  if(target) target.classList.add('active');
  toggleDrawer(false);
  updateDrawerHighlight(id);
  window.scrollTo(0,0);
}

function updateDrawerHighlight(id){
  document.querySelectorAll('.drawer-item').forEach(el=>el.classList.remove('current'));
  document.querySelectorAll('.topic-dot').forEach(el=>el.classList.remove('current'));
  const navItem = document.getElementById('nav-'+id);
  if(navItem){
    navItem.classList.add('current');
    const topicId = id.startsWith('t1') ? 'dot-t1' : (id.startsWith('t2') ? 'dot-t2' : null);
    if(topicId) document.getElementById(topicId).classList.add('current');
  }
}

function markDone(id){
  const navItem = document.getElementById('nav-'+id);
  if(navItem) navItem.classList.add('done');
}

function showTerm(group, key){
  document.querySelectorAll('.term-btn[data-group="'+group+'"]').forEach(b=>{
    b.classList.toggle('active', b.dataset.term===key);
  });
  document.querySelectorAll('.term-panel[data-group="'+group+'"]').forEach(p=>{
    p.classList.toggle('active', p.dataset.term===key);
  });
}

function selectChoice(btn){
  const q = btn.closest('.quiz-q');
  if(q.classList.contains('submitted')) return;
  q.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected'));
  btn.classList.add('selected');
}

function submitAnswer(tid, i, n){
  const q = document.getElementById(tid+'-q'+i);
  if(q.classList.contains('submitted')) return;
  const selected = q.querySelector('.choice.selected');
  if(!selected) return;
  q.classList.add('submitted');
  q.querySelectorAll('.choice').forEach(c=>{
    c.classList.add('disabled');
    if(c.dataset.correct==='true') c.classList.add('correct');
    else if(c===selected) c.classList.add('wrong');
  });
  const isCorrect = selected.dataset.correct==='true';
  if(isCorrect){ scores[tid]++; q.querySelector('.feedback.ok').style.display='block'; }
  else { q.querySelector('.feedback.no').style.display='block'; }
  q.querySelector('.submit-btn').style.display='none';
  q.querySelector('.next-btn').style.display='inline-flex';
}

function nextQuestion(tid, i, n){
  document.getElementById(tid+'-q'+i).classList.remove('active');
  if(i<n){
    document.getElementById(tid+'-q'+(i+1)).classList.add('active');
  } else {
    document.getElementById(tid+'-result').classList.add('active');
    document.getElementById(tid+'-score').textContent = scores[tid];
    markDone(tid+'-quiz');
  }
}

function resetQuiz(tid, n){
  scores[tid] = 0;
  for(let i=1;i<=n;i++){
    const q = document.getElementById(tid+'-q'+i);
    q.classList.remove('active','submitted');
    q.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected','correct','wrong','disabled'));
    q.querySelector('.feedback.ok').style.display='none';
    q.querySelector('.feedback.no').style.display='none';
    q.querySelector('.submit-btn').style.display='inline-flex';
    q.querySelector('.next-btn').style.display='none';
  }
  document.getElementById(tid+'-q1').classList.add('active');
  document.getElementById(tid+'-result').classList.remove('active');
}

const quizLengths = { t1: 30, t2: 30 };

function openQuiz(tid){
  resetQuiz(tid, quizLengths[tid]);
  showView(tid+'-quiz');
}
