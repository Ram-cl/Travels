const listing = 'https://www.justdial.com/Hyderabad/Sri-Vengamamba-Travels-Near-By-Ozone-Hospital-Lb-Nagar/040PXX40-XX40-250613173617-N4K5_BZDET';
document.querySelectorAll('.listing-link').forEach(link => { link.href = listing; });
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(nav&&nav.classList.contains('open')&&header&&!header.contains(e.target)){closeMenu();}});
document.querySelectorAll('.slide-dot').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.slide);document.querySelectorAll('.hero-image').forEach((image,i)=>image.classList.toggle('active',i===index));document.querySelectorAll('.slide-dot').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});}));
const header=document.querySelector('.header');
function updateHeader(){if(header)header.classList.toggle('scrolled',window.scrollY>70)}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const heroMedia=document.querySelector('.hero-media');
let framePending=false;
function onScroll(){if(framePending)return;framePending=true;requestAnimationFrame(()=>{updateHeader();if(heroMedia)heroMedia.style.transform=reducedMotion.matches?'none':`translateY(${Math.min(scrollY,innerHeight)*.13}px)`;framePending=false;});}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
if(!reducedMotion.matches && 'IntersectionObserver' in window){
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.section-heading,.service-card,.about>div,.contact>div,.page-hero').forEach(element=>{element.classList.add('reveal');observer.observe(element);});
}

// Services Category Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
const serviceCards = document.querySelectorAll('.service-card');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const category = tab.dataset.filter;
    serviceCards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? 'flex' : 'none';
      if (match) {
        card.classList.add('visible');
      }
    });
  });
});

