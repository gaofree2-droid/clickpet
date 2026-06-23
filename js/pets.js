// ===== ClickPet — Pet Data Configuration =====

// Evolution stage definitions (0-indexed)
var STAGES = [
  { id: 1, name: "🥚 蛋蛋",  minLevel: 1  },
  { id: 2, name: "👶 幼崽",  minLevel: 5  },
  { id: 3, name: "🧒 成长期", minLevel: 15 },
  { id: 4, name: "💪 成熟体", minLevel: 30 },
  { id: 5, name: "✨ 稀有体", minLevel: 50 },
  { id: 6, name: "🐲 传说体", minLevel: 80 },
  { id: 7, name: "👑 神话体", minLevel: 120 }
];

// Returns hearts needed to advance from currentLevel to currentLevel+1
function heartsForNextLevel(stage, currentLevel) {
  return Math.max(1, stage) * currentLevel * 5;
}

// 18 pet types — each has 7 stage-specific emojis + names
var PET_TYPES = {
  // === Basic Series (unlocked at start) ===
  cat: {
    id: "cat", name: "猫咪系", emoji: "🐱", series: "basic", unlock: null,
    stageEmojis: ["🥚","🐱","😺","🐈","😼","🐯","👑"],
    stages: ["🥚 猫蛋","🐱 小猫崽","😺 成长猫","🐈 成熟猫","✨ 幻影猫","🐯 虎纹猫","👑 猫神"]
  },
  dog: {
    id: "dog", name: "狗狗系", emoji: "🐶", series: "basic", unlock: null,
    stageEmojis: ["🥚","🐶","🐕","🦮","🐩","🦊","👑"],
    stages: ["🥚 狗蛋","🐶 小狗崽","🐕 成长犬","🦮 成熟犬","✨ 幻影犬","🦊 灵犬","👑 犬神"]
  },
  rabbit: {
    id: "rabbit", name: "兔兔系", emoji: "🐰", series: "basic", unlock: null,
    stageEmojis: ["🥚","🐰","🐇","🐿️","🐾","🦘","👑"],
    stages: ["🥚 兔蛋","🐰 兔宝宝","🐇 成长兔","🐿️ 成熟兔","✨ 幻影兔","🐾 灵兔","👑 兔仙"]
  },

  // === Forest Series (any basic at stage 3) ===
  fox: {
    id: "fox", name: "狐狸系", emoji: "🦊", series: "forest", unlock: { type: "anyStage3", series: "basic" },
    stageEmojis: ["🥚","🦊","🐺","🦝","🔥","🌲","👑"],
    stages: ["🥚 狐蛋","🦊 小狐崽","🐺 成长狐","🦝 成熟狐","✨ 幻影狐","🔥 灵狐","👑 狐仙"]
  },
  bear: {
    id: "bear", name: "熊熊系", emoji: "🐻", series: "forest", unlock: { type: "anyStage3", series: "basic" },
    stageEmojis: ["🥚","🐻","🐨","🐼","🧸","🌲","👑"],
    stages: ["🥚 熊蛋","🐻 熊宝宝","🐨 成长熊","🐼 成熟熊","✨ 幻影熊","🌲 灵熊","👑 熊王"]
  },
  panda: {
    id: "panda", name: "熊猫系", emoji: "🐼", series: "forest", unlock: { type: "anyStage3", series: "basic" },
    stageEmojis: ["🥚","🐼","🎋","🐾","☯️","🏯","👑"],
    stages: ["🥚 熊猫蛋","🐼 熊猫崽","🎋 成长熊猫","🐾 成熟熊猫","☯️ 幻影熊猫","🏯 灵熊猫","👑 熊猫王"]
  },

  // === Grassland Series (any basic at stage 4) ===
  lion: {
    id: "lion", name: "狮子系", emoji: "🦁", series: "grassland", unlock: { type: "anyStage4", series: "basic" },
    stageEmojis: ["🥚","🦁","🐱","🐯","✨","☀️","👑"],
    stages: ["🥚 狮蛋","🦁 小狮崽","🐱 成长狮","🐯 成熟狮","✨ 幻影狮","☀️ 灵狮","👑 狮王"]
  },
  elephant: {
    id: "elephant", name: "大象系", emoji: "🐘", series: "grassland", unlock: { type: "anyStage4", series: "basic" },
    stageEmojis: ["🥚","🐘","🐘💨","🐘🌿","✨","🌍","👑"],
    stages: ["🥚 象蛋","🐘 小象崽","🐘💨 成长象","🐘🌿 成熟象","✨ 幻影象","🌍 灵象","👑 象神"]
  },
  giraffe: {
    id: "giraffe", name: "长颈鹿系", emoji: "🦒", series: "grassland", unlock: { type: "anyStage4", series: "basic" },
    stageEmojis: ["🥚","🦒","🦒🌱","🦒☁️","✨","🌿","👑"],
    stages: ["🥚 鹿蛋","🦒 小鹿崽","🦒🌱 成长鹿","🦒☁️ 成熟鹿","✨ 幻影鹿","🌿 灵鹿","👑 鹿仙"]
  },

  // === Polar Series (any basic at stage 5) ===
  arcticFox: {
    id: "arcticFox", name: "北极狐系", emoji: "🦊❄️", series: "polar", unlock: { type: "anyStage5", series: "basic" },
    stageEmojis: ["🥚","🦊","❄️","🏔️","✨","🌨️","👑"],
    stages: ["🥚 冰蛋","🦊 雪狐崽","❄️ 成长雪狐","🏔️ 成熟雪狐","✨ 幻影雪狐","🌨️ 灵雪狐","👑 冰雪王"]
  },
  penguin: {
    id: "penguin", name: "企鹅系", emoji: "🐧", series: "polar", unlock: { type: "anyStage5", series: "basic" },
    stageEmojis: ["🥚","🐧","🐧❄️","🐧🎩","✨","🌊","👑"],
    stages: ["🥚 企鹅蛋","🐧 企鹅崽","🐧❄️ 成长企鹅","🐧🎩 成熟企鹅","✨ 幻影企鹅","🌊 灵企鹅","👑 企鹅帝"]
  },
  seal: {
    id: "seal", name: "海豹系", emoji: "🦭", series: "polar", unlock: { type: "anyStage5", series: "basic" },
    stageEmojis: ["🥚","🦭","🦭💦","🦭🌊","✨","🌊","👑"],
    stages: ["🥚 海豹蛋","🦭 海豹崽","🦭💦 成长海豹","🦭🌊 成熟海豹","✨ 幻影海豹","🌊 灵海豹","👑 海豹王"]
  },

  // === Legend Series (any from first 3 series at stage 6) ===
  dragon: {
    id: "dragon", name: "龙系", emoji: "🐉", series: "legend", unlock: { type: "anyStage6", series: ["basic","forest","grassland"] },
    stageEmojis: ["🥚","🐉","🐲","🔥","✨","☄️","👑"],
    stages: ["🥚 龙蛋","🐉 幼龙崽","🐲 成长龙","🔥 成熟龙","✨ 幻影龙","☄️ 灵龙","👑 龙王"]
  },
  phoenix: {
    id: "phoenix", name: "凤凰系", emoji: "🦅", series: "legend", unlock: { type: "anyStage6", series: ["basic","forest","grassland"] },
    stageEmojis: ["🥚","🐥","🕊️","🔥","✨","☀️","👑"],
    stages: ["🥚 凤蛋","🐥 雏凤","🕊️ 成长凤","🔥 成熟凤","✨ 幻影凤","☀️ 灵凤","👑 凤皇"]
  },
  unicorn: {
    id: "unicorn", name: "独角兽系", emoji: "🦄", series: "legend", unlock: { type: "anyStage6", series: ["basic","forest","grassland"] },
    stageEmojis: ["🥚","🦄","🐴","💎","✨","🌙","👑"],
    stages: ["🥚 独角兽蛋","🦄 幼独角兽","🐴 成长独角兽","💎 成熟独角兽","✨ 幻影独角兽","🌙 灵独角兽","👑 独角兽王"]
  },

  // === Mystic Series (any legend at stage 7) ===
  pixel: {
    id: "pixel", name: "像素系", emoji: "👾", series: "mystic", unlock: { type: "anyStage7", series: "legend" },
    stageEmojis: ["🥚","👾","🕹️","💾","✨","🖥️","👑"],
    stages: ["🥚 像素蛋","👾 像素崽","🕹️ 成长像素","💾 成熟像素","✨ 幻影像素","🖥️ 灵像素","👑 像素王"]
  },
  cosmic: {
    id: "cosmic", name: "星空系", emoji: "🌌", series: "mystic", unlock: { type: "anyStage7", series: "legend" },
    stageEmojis: ["🥚","🌟","🌠","🪐","✨","🌌","👑"],
    stages: ["🥚 星蛋","🌟 星崽","🌠 成长星","🪐 成熟星","✨ 幻影星","🌌 灵星","👑 星神"]
  },
  ghost: {
    id: "ghost", name: "幽灵系", emoji: "👻", series: "mystic", unlock: { type: "anyStage7", series: "legend" },
    stageEmojis: ["🥚","👻","💀","🌑","✨","🏚️","👑"],
    stages: ["🥚 幽灵蛋","👻 小幽灵","💀 成长幽灵","🌑 成熟幽灵","✨ 幻影幽灵","🏚️ 灵幽灵","👑 幽灵王"]
  }
};

// Get current stage index (0-based) for a given level
function getStageForLevel(level) {
  for (var i = STAGES.length - 1; i >= 0; i--) {
    if (level >= STAGES[i].minLevel) return i;
  }
  return 0;
}

// Get stage display name for a pet at a given stage index
function getStageName(petId, stageIndex) {
  var pet = PET_TYPES[petId];
  if (pet && pet.stages[stageIndex]) return pet.stages[stageIndex];
  return STAGES[stageIndex] ? STAGES[stageIndex].name : "未知";
}

// Get stage emoji for a pet at a given stage index
function getStageEmoji(petId, stageIndex) {
  var pet = PET_TYPES[petId];
  if (pet && pet.stageEmojis && pet.stageEmojis[stageIndex]) return pet.stageEmojis[stageIndex];
  return PET_TYPES[petId] ? PET_TYPES[petId].emoji : "🐱";
}

// Check if a pet type is unlocked given current pet states
function isUnlocked(petId, allPets) {
  var pet = PET_TYPES[petId];
  if (!pet.unlock) return true;
  var cond = pet.unlock;
  if (cond.type === "anyStage3") return hasAnyPetAtStage(allPets, cond.series, 2);
  if (cond.type === "anyStage4") return hasAnyPetAtStage(allPets, cond.series, 3);
  if (cond.type === "anyStage5") return hasAnyPetAtStage(allPets, cond.series, 4);
  if (cond.type === "anyStage6") return hasAnyPetAtMultiSeries(allPets, cond.series, 5);
  if (cond.type === "anyStage7") return hasAnyPetAtMultiSeries(allPets, cond.series, 6);
  return false;
}

function hasAnyPetAtStage(allPets, seriesFilter, targetStageIndex) {
  var keys = Object.keys(PET_TYPES);
  for (var i = 0; i < keys.length; i++) {
    var pt = PET_TYPES[keys[i]];
    var match = pt.series === seriesFilter || (Array.isArray(seriesFilter) && seriesFilter.indexOf(pt.series) >= 0);
    if (match && allPets[keys[i]] && allPets[keys[i]].unlocked && allPets[keys[i]].stage >= targetStageIndex) {
      return true;
    }
  }
  return false;
}

function hasAnyPetAtMultiSeries(allPets, seriesList, targetStageIndex) {
  for (var i = 0; i < seriesList.length; i++) {
    if (hasAnyPetAtStage(allPets, seriesList[i], targetStageIndex)) return true;
  }
  return false;
}

// Get all pet type IDs in order
function getAllPetIds() {
  return Object.keys(PET_TYPES);
}

// Run unlock check and return newly unlocked pet IDs
function checkNewUnlocks(allPets) {
  var newlyUnlocked = [];
  var keys = getAllPetIds();
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    if (allPets[id] && allPets[id].unlocked) continue;
    if (isUnlocked(id, allPets)) {
      allPets[id] = allPets[id] || {};
      allPets[id].unlocked = true;
      allPets[id].level = allPets[id].level || 1;
      allPets[id].stage = allPets[id].stage || 0;
      allPets[id].hearts = allPets[id].hearts || 0;
      allPets[id].clicks = allPets[id].clicks || 0;
      newlyUnlocked.push(id);
    }
  }
  return newlyUnlocked;
}
