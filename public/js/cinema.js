const backgroundFilm=document.querySelector('.hero-film');
const fleetFilm=document.querySelector('#fleet-film');
if(backgroundFilm) {
  backgroundFilm.src='assets/video/traveller-day.mp4';
  backgroundFilm.addEventListener('playing',()=>backgroundFilm.classList.add('ready'));
  backgroundFilm.addEventListener('error',()=>backgroundFilm.classList.remove('ready'));
  if(typeof reducedMotion==='undefined'||!reducedMotion.matches){
    backgroundFilm.play().catch(()=>{});
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)backgroundFilm.pause();
    else if(typeof reducedMotion==='undefined'||!reducedMotion.matches)backgroundFilm.play().catch(()=>{});
  });
}
if(fleetFilm) {
  fleetFilm.muted = true;
  fleetFilm.playsInline = true;
  if(!fleetFilm.src && !fleetFilm.querySelector('source')) {
    fleetFilm.src='assets/video/traveller-night.mp4';
  }
  if(typeof reducedMotion==='undefined'||!reducedMotion.matches){
    fleetFilm.play().catch(()=>{});
  }
  if('IntersectionObserver' in window){
    const filmObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          if(typeof reducedMotion==='undefined'||!reducedMotion.matches) fleetFilm.play().catch(()=>{});
        }else{
          fleetFilm.pause();
        }
      });
    },{threshold:0.25});
    filmObserver.observe(fleetFilm);
  }
}
if(typeof reducedMotion!=='undefined'&&!reducedMotion.matches && 'IntersectionObserver' in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.journey-intro>* , .film-layout>*').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});}

/* ===== Premium gallery lightbox + staggered reveal (scoped) ===== */
(function(){
  const mosaic=document.getElementById('galleryMosaic');
  if(!mosaic) return;
  const tiles=[...mosaic.querySelectorAll('.g-tile')];
  const lb=document.getElementById('lightbox');
  if(!lb) return;
  const lbImg=document.getElementById('lbImg'),lbTag=document.getElementById('lbTag'),lbTitle=document.getElementById('lbTitle'),lbCount=document.getElementById('lbCount');
  const btnClose=lb.querySelector('.lb-close'),btnPrev=lb.querySelector('.lb-prev'),btnNext=lb.querySelector('.lb-next');
  const viewAll=document.querySelector('.g-viewall');
  let idx=0,lastFocus=null;
  function render(){const t=tiles[idx],img=t.querySelector('img');lbImg.src=img.src;lbImg.alt=img.alt;lbTag.textContent=t.dataset.tag||'';lbTitle.textContent=t.dataset.cap||'';lbCount.textContent=(idx+1)+' / '+tiles.length;}
  function open(i){idx=i;lastFocus=document.activeElement;render();lb.hidden=false;requestAnimationFrame(()=>lb.classList.add('open'));document.body.style.overflow='hidden';btnClose.focus();}
  function close(){lb.classList.remove('open');document.body.style.overflow='';setTimeout(()=>{lb.hidden=true;},300);if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  function go(d){idx=(idx+d+tiles.length)%tiles.length;render();}
  tiles.forEach((t,i)=>t.addEventListener('click',()=>open(i)));
  if(viewAll)viewAll.addEventListener('click',()=>open(0));
  btnClose.addEventListener('click',close);
  btnPrev.addEventListener('click',()=>go(-1));
  btnNext.addEventListener('click',()=>go(1));
  lb.addEventListener('click',e=>{if(e.target===lb)close();});
  document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);});
  let sx=0;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(dx<0?1:-1);},{passive:true});
  if(document.documentElement.classList.contains('js-motion')&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){const t=en.target;const vis=tiles.filter(x=>getComputedStyle(x).display!=='none');const pos=vis.indexOf(t);t.style.transitionDelay=(Math.max(pos,0)*90)+'ms';t.classList.add('g-in');io.unobserve(t);}});},{threshold:.12});
    tiles.forEach(t=>io.observe(t));
  }else{tiles.forEach(t=>t.classList.add('g-in'));}
})();

/* ===== Horizontal Marquee Continuous Engine ===== */
(function setupMarquee(){
  const track = document.querySelector('.service-strip-track');
  const strip = document.querySelector('.service-strip');
  if(!track || !strip) return;

  // Duplicate items if needed so it seamlessly spans even ultra-wide screens
  const contents = track.querySelectorAll('.service-strip-content');
  if(contents.length > 0 && contents.length < 6) {
    for(let i = 0; i < 2; i++) {
      const clone = contents[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  }

  let rafId = null;
  function runJsMarquee() {
    if (rafId) return;
    track.style.animation = 'none';
    let offset = 0;
    const speed = 1.35; // smooth continuous scroll
    function step() {
      const half = track.scrollWidth / 2;
      offset += speed;
      if (offset >= half) {
        offset = 0;
      }
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  // Check if browser has disabled CSS animation via reduced-motion or override
  let checkCount = 0;
  let prevTransform = '';
  function verifyMotion() {
    const cs = window.getComputedStyle(track);
    const anim = cs.animationName;
    const playState = cs.animationPlayState;

    if (!anim || anim === 'none' || playState === 'paused') {
      runJsMarquee();
      return;
    }

    const curTransform = cs.transform;
    if (checkCount === 0) {
      prevTransform = curTransform;
      checkCount++;
      setTimeout(verifyMotion, 350);
    } else {
      if (curTransform === prevTransform && (curTransform === 'none' || !curTransform)) {
        runJsMarquee();
      }
    }
  }

  setTimeout(verifyMotion, 200);
})();

/* ===== Review Cards Infinite Marquee Auto-Loop ===== */
(function setupReviewMarquees(){
  const tracks = document.querySelectorAll('.marquee-track');
  tracks.forEach(track => {
    if (track.dataset.infiniteInit) return;
    track.dataset.infiniteInit = 'true';

    const originalCards = Array.from(track.children);
    if (!originalCards.length) return;

    // Clone all cards so the track has an identical second set for a seamless 100% loop
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const isReverse = track.classList.contains('reverse') || track.style.animationDirection === 'reverse';
    let checkCount = 0;
    let prevTransform = '';

    function checkReviewMotion() {
      const cs = window.getComputedStyle(track);
      const anim = cs.animationName;
      const playState = cs.animationPlayState;

      if (!anim || anim === 'none' || playState === 'paused') {
        startJsReviewTicker();
        return;
      }

      const curTransform = cs.transform;
      if (checkCount === 0) {
        prevTransform = curTransform;
        checkCount++;
        setTimeout(checkReviewMotion, 350);
      } else {
        if (curTransform === prevTransform && (curTransform === 'none' || !curTransform)) {
          startJsReviewTicker();
        }
      }
    }

    let rafId = null;
    function startJsReviewTicker() {
      if (rafId) return;
      track.style.animation = 'none';
      let offset = isReverse ? (track.scrollWidth / 2) : 0;
      const speed = isReverse ? -0.85 : 0.85;
      function step() {
        const half = track.scrollWidth / 2;
        offset += speed;
        if (!isReverse && offset >= half) {
          offset = 0;
        } else if (isReverse && offset <= 0) {
          offset = half;
        }
        track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';
        rafId = requestAnimationFrame(step);
      }
      rafId = requestAnimationFrame(step);
    }

    setTimeout(checkReviewMotion, 250);
  });
})();

