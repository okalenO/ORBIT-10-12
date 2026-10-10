(() => {
  const scene = document.querySelector('.street-scene');
  const frame = scene.querySelector('iframe');
  function exitStreet() {
    frame.removeAttribute('src');
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }
  function hideStreet() {
    scene.classList.remove('is-active');
    scene.setAttribute('aria-hidden', 'true');
  }
  function resumeStreet() {
    window.orbitGameState.currentScene = 'street';
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-active');
  }
  window.orbitStreet = {
    getSettings: () => ({ outfit: window.orbitGameState.confirmedOutfit,
      language: window.orbitMenu.getLanguage(), sound: window.orbitMenu.getBgmEnabled() }),
    returnToBedroom: () => {
      exitStreet();
      window.returnToBedroomFromDressup();
    },
    setDrink: drink => { window.orbitGameState.selectedDrink = drink; },
    enterRestaurant: () => {
      window.orbitRestaurant?.enter();
    },
    hideForRestaurant: hideStreet,
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
    scene.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-active');
    frame.src = 'street/index.html';
  });
})();
