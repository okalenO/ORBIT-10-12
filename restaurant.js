(() => {
  const scene = document.querySelector('.restaurant-game-scene');
  const frame = scene.querySelector('iframe');
  const beachChime = new Audio('street/assets/audio/wind-chime.mp3');
  beachChime.preload = 'auto';

  function exitRestaurant() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  }

  function hideRestaurant() {
    frame.contentWindow?.orbitRestaurantScene?.setPaused?.(true);
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }

  function resumeRestaurant() {
    window.orbitGameState.currentScene = 'restaurant';
    window.orbitBgm?.enter?.('restaurant');
    frame.contentWindow?.orbitRestaurantScene?.resumeFromBeach?.();
    frame.contentWindow?.orbitRestaurantScene?.setPaused?.(false);
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
    }));
  }

  window.orbitRestaurant = {
    getSettings: () => ({
      language: window.orbitMenu.getLanguage(),
      sound: window.orbitMenu.getBgmEnabled(),
    }),
    enter: () => {
      window.orbitStreet?.pause?.();
      window.orbitGameState.currentScene = 'restaurant';
      scene.setAttribute('aria-hidden', 'false');
      scene.classList.add('is-preparing');
      frame.addEventListener('load', () => {
        void scene.offsetWidth;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          scene.classList.add('is-active');
          scene.classList.remove('is-preparing');
          window.setTimeout(() => {
            window.orbitStreet?.hideForRestaurant();
            window.orbitStreet?.clearHandoff?.();
          }, 680);
        }));
      }, { once: true });
      frame.src = 'restaurant/index.html';
    },
    returnToStreet: () => {
      window.orbitStreet.resume();
      window.setTimeout(() => {
        scene.classList.remove('is-active');
        window.setTimeout(exitRestaurant, 560);
      }, 600);
    },
    hideForBeach: hideRestaurant,
    pauseForBeach: () => frame.contentWindow?.orbitRestaurantScene?.setPaused?.(true),
    resume: resumeRestaurant,
    playBeachChime: () => {
      if (!window.orbitMenu.getBgmEnabled()) return;
      beachChime.currentTime = 0;
      beachChime.volume = .78;
      beachChime.play().catch(() => {});
    },
    goToBeach: () => window.orbitBeach?.enter(),
    setLanguage: language => window.orbitMenu.setLanguage(language),
    toggleSound: () => window.orbitMenu.toggleBgm(),
    onSceneReady: () => window.orbitBgm?.enter?.('restaurant'),
    updateResult: result => { window.orbitGameState.restaurantResult = result; },
  };

  window.addEventListener('orbit-language-change', event => {
    frame.contentWindow?.orbitRestaurantScene?.setLanguage(event.detail.language);
  });
  window.addEventListener('orbit-bgm-change', event => {
    frame.contentWindow?.orbitRestaurantScene?.setSound(event.detail.enabled);
  });
  window.resetRestaurantScene = exitRestaurant;
})();
