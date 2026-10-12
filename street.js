(() => {
  const scene = document.querySelector('.street-scene');
  const frame = scene.querySelector('iframe');
  let frameReady = false;
  let preloading = false;
  let preparePromise = null;

  function exitStreet() {
    frame.removeAttribute('src');
    frameReady = false;
    preloading = false;
    preparePromise = null;
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  }

  function prepareStreet() {
    if (frameReady) return Promise.resolve();
    if (preparePromise) return preparePromise;
    preloading = true;
    preparePromise = new Promise(resolve => {
      frame.addEventListener('load', async () => {
        const controller = frame.contentWindow?.orbitStreetScene;
        controller?.setPreloaded?.(true);
        await controller?.prepareTransition?.();
        frameReady = true;
        resolve();
      }, { once: true });
      frame.src = 'street/index.html?v=20261012-copy1';
    });
    return preparePromise;
  }

  async function showStreet() {
    await prepareStreet();
    preloading = false;
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    await frame.contentWindow?.orbitStreetScene?.activate?.(window.orbitGameState.confirmedOutfit);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
    }));
  }
  function hideStreet() {
    frame.contentWindow?.orbitStreetScene?.setPaused?.(true);
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }
  function resumeStreet() {
    window.orbitGameState.currentScene = 'street';
    window.orbitBgm?.enter?.('street');
    frame.contentWindow?.orbitStreetScene?.resumeFromRestaurant?.();
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
    }));
  }
  window.orbitStreet = {
    getSettings: () => ({ outfit: window.orbitGameState.confirmedOutfit,
      language: window.orbitMenu.getLanguage(), sound: window.orbitMenu.getBgmEnabled(), paused: preloading }),
    prepare: prepareStreet,
    returnToBedroom: () => {
      exitStreet();
      window.returnToBedroomFromDressup();
    },
    setDrink: drink => {
      window.orbitGameState.selectedDrink = drink;
      if (drink) {
        window.orbitGameState.drinkChoice = drink;
        try { localStorage.setItem('orbit:drinkChoice', drink); } catch (_error) {}
      }
    },
    enterRestaurant: () => {
      window.orbitRestaurant?.enter();
    },
    onSceneReady: () => {
      window.orbitBgm?.enter?.('street');
      window.orbitBgm?.preload?.('restaurant');
    },
    hideForRestaurant: hideStreet,
    pause: () => frame.contentWindow?.orbitStreetScene?.setPaused?.(true),
    clearHandoff: () => frame.contentWindow?.orbitStreetScene?.clearHandoff?.(),
    resume: resumeStreet,
  };
  window.resetStreetScene = exitStreet;
  window.addEventListener('orbit-language-change', event => frame.contentWindow?.orbitStreetScene?.setLanguage(event.detail.language));
  window.addEventListener('orbit-bgm-change', event => frame.contentWindow?.orbitStreetScene?.setSound(event.detail.enabled));
  window.addEventListener('orbit-next-scene-request', event => {
    if (event.detail.from !== 'bedroom' || event.detail.next !== 'lunch' ||
        window.orbitGameState.currentScene !== 'bedroom') return;
    window.orbitGameState.currentScene = 'street';
    window.orbitGameState.selectedDrink = null;
    preloading = false;
    showStreet();
  });
})();
