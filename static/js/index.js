// Keep original global flag
window.HELP_IMPROVE_VIDEOJS = false;

// ===== (Original) Interpolation image preloading =====
var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

// ===== (Original) DOM ready =====
$(document).ready(function() {
  // (Original) Navbar burger toggle
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  // (Original) Bulma carousel options and init
  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,  // Was 3 in original Nerfies code
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  }

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('.carousel', options);

  // Loop on each carousel initialized
  for (var i = 0; i < carousels.length; i++) {
    // Add listener to event
    carousels[i].on('before:show', state => {
      console.log(state);
    });
  }

  // Access to bulmaCarousel instance of an element
  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    // bulmaCarousel instance is available as element.bulmaCarousel
    element.bulmaCarousel.on('before-show', function(state) {
      console.log(state);
    });
  }

  /* (Original, commented)
  var player = document.getElementById('interpolation-video');
  player.addEventListener('loadedmetadata', function() {
    $('#interpolation-slider').on('input', function(event) {
      console.log(this.value, player.duration);
      player.currentTime = player.duration / 100 * this.value;
    })
  }, false);
  */

  // (Original) Interpolation image setup
  preloadInterpolationImages();
  $('#interpolation-slider').on('input', function(event) {
    setInterpolationImage(this.value);
  });
  setInterpolationImage(0);
  $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

  // (Original) Bulma slider init
  bulmaSlider.attach();

  // ===== (New) Init custom image carousel if present =====
  if (document.getElementById('resultsCarousel')) {
    initCustomCarouselLoop('resultsCarousel');
  }
});

// ===== (New) Custom Image Carousel (dependency-free, same logic as working version) =====
function initCustomCarouselLoop(rootId) {
  const DURATION = 360; // ms

  const root = document.getElementById(rootId);
  if (!root) return;

  const track    = root.querySelector('.ic-track');
  const slides0  = Array.from(root.querySelectorAll('.ic-slide')); // real slides
  const prevBtn  = root.querySelector('.ic-prev');
  const nextBtn  = root.querySelector('.ic-next');
  const dotsWrap = root.querySelector('.ic-dots');
  if (!track || slides0.length === 0) return;

  // Build dots for REAL slides
  dotsWrap.innerHTML = '';
  slides0.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ic-dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goTo(i + 1, true));
    dotsWrap.appendChild(b);
  });

  // Clone ends for seamless loop
  const firstClone = slides0[0].cloneNode(true);
  const lastClone  = slides0[slides0.length - 1].cloneNode(true);
  firstClone.classList.add('is-clone');
  lastClone.classList.add('is-clone');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  const slides = Array.from(track.querySelectorAll('.ic-slide')); // with clones
  let index = 1; // start at first REAL
  let isTransitioning = false;
  let transTimer = null;

  function setTransition(on) {
    track.style.transition = on ? `transform ${DURATION}ms ease` : 'none';
  }
  function translate() {
    track.style.transform = `translate3d(${index * -100}%, 0, 0)`;
  }
  function realIndex() {
    let r = index - 1;
    if (r < 0) r = slides0.length - 1;
    if (r >= slides0.length) r = 0;
    return r;
  }
  function updateDots() {
    dotsWrap.querySelectorAll('.ic-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === realIndex())
    );
  }
  function endTransitionSafe() {
    isTransitioning = false;
    if (transTimer) { clearTimeout(transTimer); transTimer = null; }
  }

  function goTo(i, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    setTransition(animate);
    index = i;
    translate();
    updateDots();

    if (animate) {
      clearTimeout(transTimer);
      transTimer = setTimeout(() => {
        handleEdgeSnapIfNeeded();
        endTransitionSafe();
      }, DURATION + 150);
    } else {
      endTransitionSafe();
    }
  }

  function next() { goTo(index + 1, true); }
  function prev() { goTo(index - 1, true); }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Seamless loop: snap instantly if we land on a clone
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    clearTimeout(transTimer);
    handleEdgeSnapIfNeeded();
    endTransitionSafe();
  });

  function handleEdgeSnapIfNeeded() {
    const onLeftClone  = (index === 0);
    const onRightClone = (index === slides.length - 1);
    if (!onLeftClone && !onRightClone) return;

    setTransition(false);
    index = onLeftClone ? slides.length - 2 : 1; // last real or first real
    translate();
    void track.offsetWidth; // reflow
    requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
  }

  // Keyboard
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // Swipe / drag (ignore when starting on arrows/dots)
  let dragging = false, startX = 0, lastX = 0;
  const threshold = 40;

  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.ic-nav') || e.target.closest('.ic-dots')) return;
    dragging = true;
    startX = lastX = e.clientX;
    setTransition(false);
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    lastX = e.clientX;
    const dx = lastX - startX;
    track.style.transform = `translate3d(calc(${index * -100}% + ${dx}px), 0, 0)`;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    const dx = lastX - startX;
    setTransition(true);
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    else goTo(index, true); // snap back to current
  }
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);
  root.addEventListener('pointerleave', endDrag);

  // Init (no animation)
  setTransition(false);
  translate();
  updateDots();
  requestAnimationFrame(() => setTransition(true));
}
