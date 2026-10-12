(() => {
  const scene = document.querySelector('.epilogue-game-scene');
  const frame = scene.querySelector('iframe');
  let finaleAudioEnded = false;

  function getSettings() {
    const state = window.orbitGameState;
    return {
      language: window.orbitMenu.getLanguage(),
      outfit: state.confirmedOutfit,
      drink: state.drinkChoice || state.selectedDrink,
      lunch: state.restaurantResult?.selectedDish,
      cake: state.restaurantResult?.cakeDesign,
      card: state.restaurantResult?.card,
      photo: state.beachResult,
    };
  }

  function prepare() {
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.add('is-active')));
  }

  function show() {
    window.orbitGameState.currentScene = 'epilogue';
    finaleAudioEnded = finaleAudioEnded || window.orbitFinale?.isFinaleAudioFinished?.();
    if (finaleAudioEnded) window.orbitBgm?.enter?.('menu', 1600);
    else window.orbitBgm?.stop?.(0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-ready');
      scene.classList.remove('is-preparing');
      window.setTimeout(() => window.orbitFinale?.hideForEpilogue?.(), 900);
    }));
  }

  function exit() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active', 'is-preparing', 'is-ready');
    scene.setAttribute('aria-hidden', 'true');
  }

  window.orbitEpilogue = {
    getSettings,
    enter() {
      prepare();
      if (frame.getAttribute('src')) { show(); return; }
      frame.addEventListener('load', show, { once:true });
      frame.src = 'epilogue/index.html';
    },
    onFinaleAudioEnded() {
      finaleAudioEnded = true;
      if (window.orbitGameState.currentScene === 'epilogue') window.orbitBgm?.enter?.('menu', 1800);
    },
    returnToMainMenu() {
      exit();
      window.resetFinaleScene?.();
      window.resetMenu?.();
    },
  };
  window.resetEpilogueScene = exit;
})();
