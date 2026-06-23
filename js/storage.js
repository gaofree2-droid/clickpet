// ===== ClickPet — Storage Module =====

var STORAGE_KEY = "clickpet_data";

function getDefaultState() {
  return {
    hearts: 0,
    activePet: "cat",
    pets: createPetSlots(),
    stats: {
      totalClicks: 0,
      totalAds: 0,
      totalEvolved: 0,
      firstPlay: new Date().toISOString().slice(0, 10)
    }
  };
}

function createPetSlots() {
  var slots = {};
  var ids = getAllPetIds();
  for (var i = 0; i < ids.length; i++) {
    var pt = PET_TYPES[ids[i]];
    slots[ids[i]] = {
      unlocked: pt.unlock === null,
      level: 1,
      stage: 0,
      hearts: 0,
      clicks: 0
    };
  }
  return slots;
}

function saveGame(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("ClickPet: localStorage save failed", e);
  }
}

function loadGame() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return mergeWithDefaults(JSON.parse(raw));
    }
  } catch (e) {
    console.warn("ClickPet: localStorage load failed", e);
  }
  return getDefaultState();
}

function mergeWithDefaults(data) {
  var ids = getAllPetIds();
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    if (!data.pets[id]) {
      data.pets[id] = {
        unlocked: PET_TYPES[id].unlock === null,
        level: 1,
        stage: 0,
        hearts: 0,
        clicks: 0
      };
    } else {
      if (data.pets[id].unlocked === undefined) data.pets[id].unlocked = (PET_TYPES[id].unlock === null);
      if (data.pets[id].level === undefined) data.pets[id].level = 1;
      if (data.pets[id].stage === undefined) data.pets[id].stage = 0;
      if (data.pets[id].hearts === undefined) data.pets[id].hearts = 0;
      if (data.pets[id].clicks === undefined) data.pets[id].clicks = 0;
    }
  }
  if (!data.stats) data.stats = getDefaultState().stats;
  if (data.activePet === undefined) data.activePet = "cat";
  if (data.hearts === undefined) data.hearts = 0;
  if (data.stats.totalClicks === undefined) data.stats.totalClicks = 0;
  if (data.stats.totalAds === undefined) data.stats.totalAds = 0;
  if (data.stats.totalEvolved === undefined) data.stats.totalEvolved = 0;
  return data;
}
