(() => {
  const scene = document.querySelector('.street-scene');
  const frame = scene.querySelector('iframe');
  let frameReady = false;
  let preloading = false;

  function exitStreet() {
    frame.removeAttribute('src');
    frameReady = false;
    preloading = false;
    scene.classList.remove('is-active', 'is-preparing');
    scene.setAttribute('aria-hidden', 'true');
  }

  function prepareStreet() {
    if (frame.getAttribute('src')) return;
    preloading = true;
    frame.addEventListener('load', () => {
      frameReady = true;
      frame.contentWindow?.orbitStreetScene?.setPreloaded?.(true);
    }, { once: true });
    frame.src = 'street/index.html';
  }

  function showStreet() {
    preloading = false;
    frame.contentWindow?.orbitStreetScene?.activate?.(window.orbitGameState.confirmedOutfit);
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-preparing');
    void scene.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scene.classList.add('is-active');
      scene.classList.remove('is-preparing');
    }));
  }
  function hideStreet() {
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }
  function resumeStreet() {
    window.orbitGameState.currentScene = 'street';
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
    setDrink: drink => { window.orbitGameState.selectedDrink = drink; },
    enterRestaurant: () => {
      window.orbitRestaurant?.enter();
    },
    hideForRestaurant: hideStreet,
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
    if (frameReady) showStreet();
    else {
      prepareStreet();
      frame.addEventListener('load', showStreet, { once: true });
    }
  });
})();
