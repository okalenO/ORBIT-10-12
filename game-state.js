// Shared gameplay data only. Each scene owns its DOM, dialogue and animation timers.
window.orbitGameState = Object.assign({
  currentScene: "menu", // menu | bedroom | dressup
  bedroomState: "inactive", // detailed bedroom interaction phase
  wardrobeState: "closed", // closed | open
  characterState: "sleeping", // sleeping | wakeQueued | waking | awake | dressed
  selectedOutfit: null, // last normal outfit tried on; retained when going back
  confirmedOutfit: null, // outfit committed to the bedroom character
  previewOutfit: null, // temporary bear preview; never confirmed
  bearUnlocked: false,
}, window.orbitGameState || {});
