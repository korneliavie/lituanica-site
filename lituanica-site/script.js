(function(){
  // Sticky header shadow
  var header=document.getElementById('siteHeader');
  if(header){
    window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>10);},{passive:true});
  }

  // Mobile menu
  var toggle=document.getElementById('navToggle'), menu=document.getElementById('menu');
  if(toggle && menu){
    toggle.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open);
    });
  }

  // Mark the current page in the menu
  var here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.menu a').forEach(function(a){
    var target=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(target===here || (here==='' && target==='index.html')) a.classList.add('active');
  });

  // Hero slideshow with dots (only on pages that have one)
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var dotsWrap=document.getElementById('dots');
  if(slides.length && dotsWrap){
    var idx=0,timer;
    slides.forEach(function(_,i){
      var b=document.createElement('button');
      b.setAttribute('aria-label','Show photo '+(i+1));
      b.addEventListener('click',function(){go(i);restart();});
      dotsWrap.appendChild(b);
    });
    var go=function(i){
      idx=(i+slides.length)%slides.length;
      slides.forEach(function(s,k){s.classList.toggle('on',k===idx);});
      [].forEach.call(dotsWrap.children,function(d,k){d.classList.toggle('on',k===idx);});
    };
    var restart=function(){clearInterval(timer);timer=setInterval(function(){go(idx+1);},6000);};
    go(0);restart();
    var hero=document.getElementById('home');
    if(hero){
      hero.addEventListener('mouseenter',function(){clearInterval(timer);});
      hero.addEventListener('mouseleave',restart);
    }
  }

  // Tryout tabs
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected',x===t);});
      document.querySelectorAll('.tabpanel').forEach(function(p){p.classList.toggle('on',p.id===t.dataset.tab);});
    });
  });

  // Click to copy: copies automatically, shows a confirmation
  var toast=document.getElementById('toast'), toastTimer;
  function showToast(msg){
    if(!toast) return;
    toast.textContent=msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){toast.classList.remove('show');},1600);
  }
  function fallbackCopy(text){
    var ta=document.createElement('textarea');
    ta.value=text;
    ta.setAttribute('readonly','');
    ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    var ok=false;
    try{ok=document.execCommand('copy');}catch(e){ok=false;}
    document.body.removeChild(ta);
    return ok;
  }
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var text=btn.dataset.copy;
      var hint=btn.querySelector('.hint');
      function success(){
        btn.classList.add('done');
        if(hint) hint.textContent='Copied';
        showToast('Copied: '+text);
        setTimeout(function(){btn.classList.remove('done');if(hint)hint.textContent='Copy';},1600);
      }
      function failure(){showToast('Select and copy: '+text);}
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(success,function(){
          if(fallbackCopy(text)) success(); else failure();
        });
      } else {
        if(fallbackCopy(text)) success(); else failure();
      }
    });
  });

  // Scroll reveal (content stays visible if JS or IntersectionObserver is unavailable)
  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:0.12});
    reveals.forEach(function(el){io.observe(el);});
  } else {
    reveals.forEach(function(el){el.classList.add('in');});
  }
})();
