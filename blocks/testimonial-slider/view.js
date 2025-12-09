(function(){
  function setupSlider(root){
    const slidesWrap = root.querySelector('.tsl-slides');
    if(!slidesWrap) return;
    const slides = Array.from(slidesWrap.querySelectorAll('.tsl-slide'));
    if(slides.length === 0) return;

    const autoplay = root.getAttribute('data-autoplay') === 'true';
    const speed = parseInt(root.getAttribute('data-autoplay-speed') || '4000', 10);
    const showDots = root.getAttribute('data-show-dots') === 'true';
    const showArrows = root.getAttribute('data-show-arrows') === 'true';
    const pauseOnHover = root.getAttribute('data-pause-on-hover') === 'true';

    let index = 0;
    let intervalId = null;
    let isPaused = false;

    // Build dots
    let dotsWrap = root.querySelector('.tsl-dots');
    if(showDots){
      if(!dotsWrap){
        dotsWrap = document.createElement('div');
        dotsWrap.className = 'tsl-dots';
        root.appendChild(dotsWrap);
      }
      dotsWrap.innerHTML = '';
      slides.forEach(function(_, i){
        const d = document.createElement('div');
        d.className = 'dot' + (i===0?' active':'');
        d.setAttribute('role','button');
        d.setAttribute('aria-label','Go to slide ' + (i+1));
        d.addEventListener('click', function(){ goTo(i); });
        dotsWrap.appendChild(d);
      });
    }

    // Arrows
    let prevBtn = root.querySelector('.tsl-nav.prev');
    let nextBtn = root.querySelector('.tsl-nav.next');
    if(showArrows){
      if(!prevBtn){ prevBtn = document.createElement('button'); prevBtn.className='tsl-nav prev'; prevBtn.type='button'; prevBtn.innerHTML='\u2039'; root.appendChild(prevBtn); }
      if(!nextBtn){ nextBtn = document.createElement('button'); nextBtn.className='tsl-nav next'; nextBtn.type='button'; nextBtn.innerHTML='\u203A'; root.appendChild(nextBtn); }
      prevBtn.addEventListener('click', prev);
      nextBtn.addEventListener('click', next);
    }

    function update(){
      slides.forEach(function(s, i){ s.classList.toggle('active', i===index); });
      if(dotsWrap){
        const dots = Array.from(dotsWrap.children);
        dots.forEach(function(d, i){ d.classList.toggle('active', i===index); });
      }
    }
    function goTo(i){ index = (i + slides.length) % slides.length; update(); }
    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    function start(){ if(autoplay && !intervalId){ intervalId = setInterval(function(){ if(!isPaused) next(); }, speed); } }
    function stop(){ if(intervalId){ clearInterval(intervalId); intervalId=null; } }

    if(pauseOnHover){
      root.addEventListener('mouseenter', function(){ isPaused = true; });
      root.addEventListener('mouseleave', function(){ isPaused = false; });
    }

    // Swipe support
    let startX=null; let endX=null;
    root.addEventListener('touchstart', function(e){ startX = e.changedTouches[0].screenX; });
    root.addEventListener('touchend', function(e){
      endX = e.changedTouches[0].screenX;
      if(startX==null||endX==null) return;
      const dx = endX - startX;
      if(Math.abs(dx)>50){ if(dx<0) next(); else prev(); }
      startX=null; endX=null;
    });

    // Pause when hidden
    document.addEventListener('visibilitychange', function(){ isPaused = document.hidden; });

    update();
    start();
  }

  function init(){
    var roots = document.querySelectorAll('.wp-block-custom-blocks-plugin-testimonial-slider, .testimonial-slider');
    roots.forEach(setupSlider);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
