(() => {
  const scene = document.querySelector('.beach-game-scene');
  const frame = scene.querySelector('iframe');

  function ensureBeachAudio() {
    if (window.orbitGameState.currentScene !== 'beach') return;
    window.orbitBgm?.enter?.('beach', 1200);
    frame.contentWindow?.orbitBeachScene?.ensureAudio?.();
  }

  function exitBeach() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  }

  function resumeBeach() {
    window.orbitGameState.currentScene = 'beach';
    window.orbitBgm?.stop?.(500);
    frame.contentWindow?.orbitBeachScene?.resumeFromFinale?.();
    ensureBeachAudio();
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
    }));
  }

  window.orbitBeach = {
    getSettings: () => ({
      outfit: window.orbitGameState.confirmedOutfit,
      language: window.orbitMenu.getLanguage(),
      sound: window.orbitMenu.getBgmEnabled(),
    }),
    enter: () => {
      window.orbitRestaurant?.pauseForBeach?.();
      window.orbitGameState.currentScene = 'beach';
      scene.setAttribute('aria-hidden', 'false');
      scene.classList.add('is-preparing');
      frame.addEventListener('load', () => {
        frame.contentWindow.ORBIT_GO_TO_NEXT_SCENE = detail => window.orbitFinale?.enter(detail);
        ensureBeachAudio();
        void scene.offsetWidth;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          scene.classList.add('is-active');
          scene.classList.remove('is-preparing');
          window.setTimeout(() => window.orbitRestaurant?.hideForBeach(), 900);
        }));
      }, { once: true });
      frame.src = 'beach/index.html?v=20261012-copy1';
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
    onSceneReady: () => window.orbitBgm?.enter?.('beach', 1100),
    updateResult: result => { window.orbitGameState.beachResult ||= result; },
    hideForFinale: () => {
      frame.contentWindow?.orbitBeachScene?.pauseForFinale?.();
      scene.classList.remove('is-active');
      scene.setAttribute('aria-hidden', 'true');
    },
    pauseForFinale: () => frame.contentWindow?.orbitBeachScene?.pauseForFinale?.(),
    resumeFromFinale: resumeBeach,
    playOcean: () => window.orbitBgm?.enter?.('beach', 1200),
    setOceanLevel: (volume, duration) => window.orbitBgm?.setLevel?.('beach', volume, duration),
  };

  window.addEventListener('orbit-language-change', event => {
    frame.contentWindow?.orbitBeachScene?.setLanguage(event.detail.language);
  });
  window.addEventListener('orbit-bgm-change', event => {
    frame.contentWindow?.orbitBeachScene?.setSound(event.detail.enabled);
  });
  document.addEventListener('pointerdown', ensureBeachAudio, true);
  document.addEventListener('keydown', ensureBeachAudio, true);
  window.resetBeachScene = exitBeach;
})();
