(function(){
  var d=document,root=d.documentElement;root.classList.add('js');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* tabs */
  var tabs=[].slice.call(d.querySelectorAll('[role="tab"]'));
  function select(t,focus,push){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;
      var p=d.getElementById(x.getAttribute('aria-controls'));
      if(on&&p.hidden){p.hidden=false;p.classList.remove('enter');void p.offsetWidth;p.classList.add('enter');p.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')});}
      else if(!on)p.hidden=true;});
    if(focus)t.focus();
    if(push&&history.replaceState)history.replaceState(null,'','#'+t.dataset.tab);
  }
  function fromHash(){var h=location.hash.slice(1);var t=tabs.filter(function(x){return x.dataset.tab===h})[0];
    if(t){select(t,false,false);d.getElementById('work').scrollIntoView();}}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t,false,true)});
    t.addEventListener('keydown',function(e){var n=null;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')n=tabs[(i+1)%tabs.length];
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=tabs[(i-1+tabs.length)%tabs.length];
      else if(e.key==='Home')n=tabs[0];else if(e.key==='End')n=tabs[tabs.length-1];
      if(n){e.preventDefault();select(n,true,true);}});
  });
  window.addEventListener('hashchange',fromHash);fromHash();
  /* reveal */
  var rv=[].slice.call(d.querySelectorAll('.rv'));
  if(reduce||!('IntersectionObserver' in window)){rv.forEach(function(e){e.classList.add('in')});}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(e){io.observe(e)});}
  /* counters */
  [].forEach.call(d.querySelectorAll('[data-count]'),function(el){
    var end=parseFloat(el.dataset.count),suf=el.dataset.suffix||'';
    if(reduce){el.textContent=end+suf;return;}
    var start=null;el.textContent='0'+suf;
    function step(ts){if(!start)start=ts;var k=Math.min((ts-start)/1200,1);el.textContent=Math.round(end*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(step);}
    var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){requestAnimationFrame(step);o.disconnect();}});o.observe(el);
  });
  if(reduce)return;
  var fine=window.matchMedia&&matchMedia('(pointer: fine)').matches;
  if(!fine)return;
  /* card tilt + shine */
  [].forEach.call(d.querySelectorAll('.gcard'),function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.transform='perspective(1000px) rotateX('+((.5-y)*5).toFixed(2)+'deg) rotateY('+((x-.5)*6).toFixed(2)+'deg) translateY(-4px)';
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');});
    c.addEventListener('pointerleave',function(){c.style.transform='';});
  });
  /* hero parallax */
  var st=d.querySelector('.cloud .stage');
  if(st)d.querySelector('.hero').addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    st.style.transform='rotateY('+(x*14)+'deg) rotateX('+(-y*10)+'deg)';});
})();
