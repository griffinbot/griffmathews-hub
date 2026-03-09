/**
 * main.js — Griff Mathews hub
 * Lightweight scroll-in animation + future hooks
 */

(function () {
  'use strict';

  // ── Scroll-fade-in for cards ──────────────────────────────────────────────

  const cards = document.querySelectorAll('.card');

  // Mark every card so CSS can apply the initial hidden state
  cards.forEach((card) => card.classList.add('anim'));

  // IntersectionObserver: reveal cards as they enter the viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.1,      // trigger when 10 % of card is visible
        rootMargin: '0px 0px -30px 0px', // slight bottom offset
      }
    );

    cards.forEach((card) => observer.observe(card));
  } else {
    // Fallback: show all cards immediately for older browsers
    cards.forEach((card) => card.classList.add('visible'));
  }

  // ── Stagger delay per card (optional visual polish) ───────────────────────
  // Applies a small CSS delay so cards cascade in rather than popping together
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 55}ms`;
  });

  // ── Future-ready event hook ───────────────────────────────────────────────
  // Attach click analytics or modal triggers here later
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      // placeholder — extend for analytics, modals, etc.
    });
  });

})();
