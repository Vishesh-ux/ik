/* ============================================================
   script.js — Ishita Page
   5 pages: Intro → "Not a template" → Advantages →
            Personal Note (blue flowers) → The Ask
   No button dances away with tease messages each time.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── References ── */
  const pages         = document.querySelectorAll('.page');
  const yesBtn        = document.getElementById('yesBtn');
  const noBtn         = document.getElementById('noBtn');
  const thankYou      = document.getElementById('thankYouMsg');
  const btnGroup      = document.getElementById('btnGroup');
  const askCard       = document.getElementById('askCard');
  const noCounterMsg  = document.getElementById('noCounterMsg');

  let noDodgeCount  = 0;
  let noEscapeMode  = false;
  let cardRect      = null;        // cached after first dodge

  /* ── Tease messages that get progressively funnier ── */
  const noPhrases = [
    "Nice try. 😏",
    "Really? That's your answer?",
    "The button doesn't agree with you 💙",
    "Hmm, it moved. Weird. Try again? 😇",
    "That's strange… it keeps slipping away.",
    "Are you sure? Your hand says otherwise 👀",
    "The No button has opinions of its own.",
    "It's almost like the universe is saying something… 🌌",
    "Okay at this point you're just playing. I see you 😄",
    "You know, some things are just not meant to be clicked.",
    "The No button has filed for retirement. Consider it gone.",
    "I'm taking this as a soft yes tbh 💙",
    "Still trying? I respect the dedication tbh 😂",
    "The No button went to get blue flowers. It'll be back. (It won't.)",
    "Okay FINE. Keep trying. I'll wait. 🫶",
  ];

  /* ── Page navigation ── */
  window.goToPage = function (index) {
    pages.forEach((p, i) => {
      if (i === index) {
        p.classList.remove('exit');
        p.classList.add('active');
        updateDots(index);
      } else {
        if (p.classList.contains('active')) {
          p.classList.add('exit');
          setTimeout(() => p.classList.remove('exit'), 620);
        }
        p.classList.remove('active');
      }
    });

    /* On arriving at page 5, anchor the No button */
    if (index === 4) {
      setTimeout(anchorNoBtn, 80);
    }
  };

  /* ── Progress dots ── */
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'progress-dots';
  for (let i = 0; i < 5; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.dataset.page = i;
    dotsContainer.appendChild(d);
  }
  document.body.appendChild(dotsContainer);

  function updateDots(activeIndex) {
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
  }

  /* ── Anchor No button inside the card ── */
  function anchorNoBtn() {
    if (noEscapeMode) return;
    noEscapeMode = true;
    cardRect = askCard.getBoundingClientRect();

    /* Measure current btn position */
    const bRect = noBtn.getBoundingClientRect();
    const startLeft = bRect.left - cardRect.left;
    const startTop  = bRect.top  - cardRect.top;

    askCard.style.position = 'relative';
    askCard.style.overflow = 'visible'; // let it roam

    noBtn.style.position  = 'absolute';
    noBtn.style.left      = startLeft + 'px';
    noBtn.style.top       = startTop  + 'px';
    noBtn.style.margin    = '0';
  }

  /* ── Dodge function ── */
  function dodge(fast) {
    cardRect = askCard.getBoundingClientRect();

    const btnW   = noBtn.offsetWidth  || 80;
    const btnH   = noBtn.offsetHeight || 44;
    const pad    = 18;

    const maxLeft = cardRect.width  - btnW  - pad;
    const maxTop  = cardRect.height - btnH  - pad;

    /* Keep away from Yes button area (rough top-centre exclusion) */
    let newLeft, newTop, attempts = 0;
    do {
      newLeft = pad + Math.random() * (maxLeft - pad);
      newTop  = pad + Math.random() * (maxTop  - pad);
      attempts++;
    } while (
      attempts < 12 &&
      newLeft > cardRect.width * 0.25 &&
      newLeft < cardRect.width * 0.65 &&
      newTop  < cardRect.height * 0.45
    );

    newLeft = Math.max(pad, Math.min(newLeft, maxLeft));
    newTop  = Math.max(pad, Math.min(newTop,  maxTop));

    noBtn.style.transition = fast
      ? 'left 0.08s ease, top 0.08s ease'
      : 'left 0.14s ease, top 0.14s ease';

    noBtn.style.left = newLeft + 'px';
    noBtn.style.top  = newTop  + 'px';

    /* Tease message */
    noDodgeCount++;
    const phrase = noPhrases[Math.min(noDodgeCount - 1, noPhrases.length - 1)];
    noCounterMsg.textContent = phrase;
    noCounterMsg.style.opacity = '0';
    requestAnimationFrame(() => {
      noCounterMsg.style.transition = 'opacity 0.3s ease';
      noCounterMsg.style.opacity = '1';
    });
  }

  /* ── Trigger dodge ── */
  function runAway(e) {
    if (!noEscapeMode) anchorNoBtn();
    if (e) e.preventDefault();
    dodge(false);
  }

  noBtn.addEventListener('mouseenter',  runAway);
  noBtn.addEventListener('touchstart',  runAway, { passive: false });
  noBtn.addEventListener('click', (e) => { e.preventDefault(); dodge(true); });

  /* ── Yes button ── */
  yesBtn.addEventListener('click', () => {
    btnGroup.style.display  = 'none';
    noCounterMsg.style.display = 'none';
    thankYou.classList.add('show');
    burstPetals(22);
  });

  /* ── Floating blue flower petals ── */
  const PETALS = ['💙', '🌸', '❄️', '✨', '🫐'];

  function spawnPetal() {
    const el = document.createElement('span');
    el.className  = 'petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];

    const x        = Math.random() * 100;
    const duration = 7 + Math.random() * 9;
    const delay    = Math.random() * 5;
    const size     = 0.8 + Math.random() * 0.9;

    el.style.cssText = `
      left: ${x}%;
      top: -40px;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay) * 1000 + 200);
  }

  setInterval(spawnPetal, 1300);
  for (let i = 0; i < 7; i++) setTimeout(spawnPetal, i * 250);

  /* ── Burst petals on yes ── */
  function burstPetals(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
        const x = 25 + Math.random() * 50;
        el.style.cssText = `
          position: fixed;
          left: ${x}%;
          top: 35%;
          font-size: ${1 + Math.random() * 1.8}rem;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          animation: petalFall ${2 + Math.random() * 3}s ease forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 6000);
      }, i * 70);
    }
  }

  /* ── Keyboard shortcut: left/right arrows to navigate (optional convenience) ── */
  document.addEventListener('keydown', (e) => {
    const cur = [...pages].findIndex(p => p.classList.contains('active'));
    if (e.key === 'ArrowRight' && cur < pages.length - 1) goToPage(cur + 1);
    if (e.key === 'ArrowLeft'  && cur > 0)               goToPage(cur - 1);
  });

});
