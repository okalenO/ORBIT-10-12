(() => {
  const scene = document.querySelector('.restaurant-game-scene');
  const frame = scene.querySelector('iframe');

  function exitRestaurant() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }

  window.orbitRestaurant = {
    getSettings: () => ({
      language: window.orbitMenu.getLanguage(),
      sound: window.orbitMenu.getBgmEnabled(),
    }),
    enter: () => {
      window.orbitGameState.currentScene = 'restaurant';
      scene.setAttribute('aria-hidden', 'false');
      scene.classList.add('is-preparing');
      frame.addEventListener('load', () => {
        requestAnimationFrame(() => {
          scene.classList.remove('is-preparing');
          scene.classList.add('is-active');
          window.orbitStreet?.hideForRestaurant();
        });
      }, { once: true });
      frame.src = 'restaurant/index.html';
    },
    returnToStreet: () => {
      window.orbitStreet.resume();
      requestAnimationFrame(() => {
        scene.classList.remove('is-active');
        window.setTimeout(exitRestaurant, 560);
      });
    },
    setLanguage: language => window.orbitMenu.setLanguage(language),
    toggleSound: () => window.orbitMenu.toggleBgm(),
    updateResult: result => { window.orbitGameState.restaurantResult = result; },
  };

  window.addEventListener('orbit-language-change', event => {
    frame.contentWindow?.orbitRestaurantScene?.setLanguage(event.detail.language);
  });
  window.addEventListener('orbit-bgm-change', event => {
    frame.contentWindow?.orbitRestaurantScene?.setSound(event.detail.enabled);
  });
})();
