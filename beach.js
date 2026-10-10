(() => {
  const scene = document.querySelector('.beach-game-scene');
  const frame = scene.querySelector('iframe');

  function exitBeach() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  }

  window.orbitBeach = {
    getSettings: () => ({
      outfit: window.orbitGameState.confirmedOutfit,
      language: window.orbitMenu.getLanguage(),
      sound: window.orbitMenu.getBgmEnabled(),
    }),
    enter: () => {
      window.orbitGameState.currentScene = 'beach';
      scene.setAttribute('aria-hidden', 'false');
      scene.classList.add('is-preparing');
      frame.addEventListener('load', () => {
        void scene.offsetWidth;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          scene.classList.add('is-active');
          scene.classList.remove('is-preparing');
          window.setTimeout(() => window.orbitRestaurant?.hideForBeach(), 900);
        }));
      }, { once: true });
      frame.src = 'beach/index.html';
    },
    returnToRestaurant: () => {
      window.orbitRestaurant?.resume();
      window.setTimeout(() => {
        scene.classList.remove('is-active');
        window.setTimeout(exitBeach, 560);
      }, 80);
    },
    setLanguage: language => window.orbitMenu.setLanguage(language),
    toggleSound: () => window.orbitMenu.toggleBgm(),
    updateResult: result => { window.orbitGameState.beachResult ||= result; },
  };

  window.addEventListener('orbit-language-change', event => {
    frame.contentWindow?.orbitBeachScene?.setLanguage(event.detail.language);
  });
  window.addEventListener('orbit-bgm-change', event => {
    frame.contentWindow?.orbitBeachScene?.setSound(event.detail.enabled);
  });
  window.resetBeachScene = exitBeach;
})();
