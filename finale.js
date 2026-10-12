(() => {
  const scene = document.querySelector('.finale-game-scene');
  const frame = scene.querySelector('iframe');

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_error) { return null; }
  }

  function finaleData() {
    const state = window.orbitGameState;
    return {
      outfit: state.confirmedOutfit,
      language: window.orbitMenu.getLanguage(),
      sound: window.orbitMenu.getBgmEnabled(),
      drinkId: state.drinkChoice || localStorage.getItem('orbit:drinkChoice') || state.selectedDrink,
      cakeConfig: state.restaurantResult?.cakeDesign || readJson('orbit:restaurantCakeDesign'),
      card: state.restaurantResult?.card || readJson('orbit:restaurantCard'),
      photo: state.beachResult || readJson('orbit:beachPhoto'),
    };
  }

  function showFinale() {
    window.orbitGameState.currentScene = 'finale';
    window.orbitBgm?.enter?.('beach', 1000);
    window.orbitBeach?.pauseForFinale?.();
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
      window.setTimeout(() => window.orbitBeach?.hideForFinale?.(), 1000);
    }));
  }

  function returnToBeach() {
    frame.contentWindow?.orbitFinaleScene?.shutdown?.();
    window.orbitBeach?.resumeFromFinale?.();
    window.setTimeout(() => {
      scene.classList.remove('is-active');
      scene.setAttribute('aria-hidden', 'true');
      frame.removeAttribute('src');
    }, 620);
  }

  function hideForEpilogue() {
    frame.contentWindow?.orbitFinaleScene?.fadeForEpilogue?.();
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }

  window.orbitFinale = {
    getSettings: finaleData,
    enter: beachResult => {
      if (beachResult) window.orbitGameState.beachResult ||= beachResult;
      if (frame.getAttribute('src')) {
        showFinale();
        return;
      }
      frame.addEventListener('load', showFinale, { once: true });
      frame.src = 'finale/index.html?v=20261012-copy1';
    },
    setLanguage: language => frame.contentWindow?.orbitFinaleScene?.setLanguage?.(language),
    setSound: enabled => frame.contentWindow?.orbitFinaleScene?.setSound?.(enabled),
    toggleSound: () => window.orbitMenu.toggleBgm(),
    playOcean: () => window.orbitBgm?.enter?.('beach', 1000),
    setOceanLevel: (volume, duration) => window.orbitBgm?.setLevel?.('beach', volume, duration),
    stopOcean: duration => window.orbitBgm?.stop?.(duration),
    returnToBeach,
    enterEpilogue: () => window.orbitEpilogue?.enter?.(),
    onFinaleAudioEnded: () => window.orbitEpilogue?.onFinaleAudioEnded?.(),
    isFinaleAudioFinished: () => Boolean(frame.contentWindow?.orbitFinaleScene?.isFinaleAudioFinished?.()),
    hideForEpilogue,
  };
  window.resetFinaleScene = () => {
    frame.contentWindow?.orbitFinaleScene?.shutdown?.();
    frame.removeAttribute('src');
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  };

  window.addEventListener('orbit-language-change', event => window.orbitFinale.setLanguage(event.detail.language));
  window.addEventListener('orbit-bgm-change', event => window.orbitFinale.setSound(event.detail.enabled));
})();
