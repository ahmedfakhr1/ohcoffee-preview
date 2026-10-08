(function(){
  // drawer
  var b=document.querySelector('.burger'), nav=document.getElementById('mnav');
  function setOpen(o){ if(!b||!nav) return; nav.classList.toggle('open',o); b.setAttribute('aria-expanded',o?'true':'false'); b.setAttribute('aria-label',o?'Close menu':'Open menu'); }
  if(b&&nav){
    b.addEventListener('click',function(){ setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click',function(e){ if(e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&nav.classList.contains('open')){ setOpen(false); b.focus(); } });
    window.addEventListener('resize',function(){ if(window.innerWidth>=900) setOpen(false); });
  }

  // time-of-day greeting (the café is open 9 am to midnight)
  var g=document.querySelector('[data-greet]');
  if(g){ var h=new Date().getHours();
    g.textContent = h<5 ? 'Up late.' : h<12 ? 'Good morning.' : h<17 ? 'Good afternoon.' : h<22 ? 'Good evening.' : 'Up late.'; }

  // the sleeve face: revealed once
  var f=document.querySelector('[data-draw]');
  if(f){
    if(!('IntersectionObserver' in window)) f.classList.add('drawn');
    else { var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ f.classList.add('drawn'); io.disconnect(); } }); },{threshold:.25}); io.observe(f); }
  }

  // chips: jump + highlight current section
  var bar=document.querySelector('.js-jump');
  if(bar){
    var chips=[].slice.call(bar.querySelectorAll('.chip'));
    var secs=chips.map(function(c){ return document.getElementById(c.getAttribute('href').slice(1)); });
    var lock=0;
    function mark(i){ chips.forEach(function(c,j){ c.classList.toggle('on',j===i); if(j===i) c.setAttribute('aria-current','true'); else c.removeAttribute('aria-current'); });
      var c=chips[i], t=bar.querySelector('.track'); if(c&&t){ t.scrollTo({left:c.offsetLeft-t.clientWidth/2+c.clientWidth/2,behavior:'smooth'}); } }
    function onScroll(){ if(Date.now()<lock) return;
      var off=bar.getBoundingClientRect().bottom+40, cur=0;
      secs.forEach(function(s,i){ if(s&&s.getBoundingClientRect().top<=off) cur=i; });
      if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) cur=secs.length-1;
      mark(cur); }
    chips.forEach(function(c,i){ c.addEventListener('click',function(e){
      var s=secs[i]; if(!s) return; e.preventDefault(); lock=Date.now()+900; mark(i);
      s.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      history.replaceState(null,'','#'+s.id); }); });
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }
})();
