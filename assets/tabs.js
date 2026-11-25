(function(){
  var tabs=[].slice.call(document.querySelectorAll('[role="tab"]'));
  if(!tabs.length)return;
  function select(t,focus,push){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
    if(focus)t.focus();
    if(push&&history.replaceState)history.replaceState(null,'','#'+t.dataset.tab);
  }
  function fromHash(){var h=location.hash.slice(1);var t=tabs.filter(function(x){return x.dataset.tab===h})[0];
    if(t){select(t,false,false);document.getElementById('work').scrollIntoView();}}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t,false,true)});
    t.addEventListener('keydown',function(e){var n=null;
      if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];
      else if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
      else if(e.key==='Home')n=tabs[0];else if(e.key==='End')n=tabs[tabs.length-1];
      if(n){e.preventDefault();select(n,true,true);}});
  });
  window.addEventListener('hashchange',fromHash);fromHash();
})();
