// ===== ClickPet — 主程序 =====

var game = null;
var dom = {};
var comboTimer = null;
var comboCount = 0;
var lastClickTime = 0;
var adCooldown = false;
var isEvolving = false;

function init() {
  cacheDom();
  game = loadGame();
  initTG();
  initAds();
  var newUnlocks = checkNewUnlocks(game.pets);
  for (var i = 0; i < newUnlocks.length; i++) {
    showToast("🎉 解锁 " + PET_TYPES[newUnlocks[i]].name + "！", 3000);
  }
  renderAll();
}

function cacheDom() {
  dom = {
    heartsDisplay: document.getElementById("hearts-display"),
    comboDisplay: document.getElementById("combo-display"),
    petArea: document.getElementById("pet-area"),
    petEmoji: document.getElementById("pet-emoji"),
    petName: document.getElementById("pet-name"),
    petLevel: document.getElementById("pet-level"),
    petStage: document.getElementById("pet-stage"),
    expBar: document.getElementById("exp-bar"),
    expText: document.getElementById("exp-text"),
    stageLine: document.getElementById("stage-line"),
    petTabs: document.getElementById("pet-tabs"),
    adBtn: document.getElementById("ad-btn"),
    toast: document.getElementById("toast"),
    evolveOverlay: document.getElementById("evolve-overlay"),
    evolveEmoji: document.getElementById("evolve-emoji"),
    evolveName: document.getElementById("evolve-name"),
    floatContainer: document.getElementById("float-container")
  };
}

// ===== 渲染 =====

function renderAll() {
  renderActivePet();
  renderPetTabs();
}

function renderActivePet() {
  var pet = game.pets[game.activePet];
  var pt = PET_TYPES[game.activePet];
  if (!pet || !pt) return;
  dom.heartsDisplay.textContent = "❤️ " + formatNumber(game.hearts);
  dom.petEmoji.textContent = getStageEmoji(game.activePet, pet.stage);
  dom.petStage.textContent = getStageName(game.activePet, pet.stage);
  dom.petName.textContent = pt.name;
  dom.petLevel.textContent = "Lv." + pet.level;

  var needed = heartsForNextLevel(pet.stage + 1, pet.level);
  var progress = Math.min(100, Math.floor((pet.hearts / needed) * 100));
  dom.expBar.style.width = progress + "%";

  var remaining = needed - pet.hearts;
  if (remaining <= 0) {
    dom.expText.textContent = "准备升级！";
  } else {
    dom.expText.textContent = pet.hearts + "/" + needed + " ❤️";
  }

  var lineHtml = "";
  for (var i = 0; i < 7; i++) {
    var cls = (i === pet.stage) ? " active" : (i < pet.stage) ? " done" : "";
    lineHtml += '<span class="stage-dot' + cls + '" title="' + getStageName(game.activePet, i) + '">' +
      (i < pet.stage ? "✔" : (i === pet.stage ? "●" : "○")) + '</span>';
    if (i < 6) lineHtml += '<span class="stage-arrow">→</span>';
  }
  dom.stageLine.innerHTML = lineHtml;
}

function renderPetTabs() {
  var ids = getAllPetIds();
  var html = "";
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var pet = game.pets[id];
    if (!pet.unlocked) {
      html += '<button class="pet-tab locked" title="未解锁" disabled>🔒</button>';
    } else {
      var ac = (id === game.activePet) ? " active" : "";
      html += '<button class="pet-tab' + ac + '" onclick="switchPet(\'' + id + '\')" title="' + PET_TYPES[id].name + '">' +
        PET_TYPES[id].emoji + '</button>';
    }
  }
  dom.petTabs.innerHTML = html;
}

// ===== 点击处理 =====

function handlePetClick(event) {
  if (isEvolving) return;
  var pet = game.pets[game.activePet];
  if (!pet || !pet.unlocked) return;

  var now = Date.now();
  if (now - lastClickTime < 800) { comboCount++; }
  else { comboCount = 1; }
  lastClickTime = now;

  if (comboCount >= 3) {
    dom.comboDisplay.textContent = "⚡连击 x" + comboCount;
    dom.comboDisplay.style.opacity = "1";
  }
  if (comboCount >= 10 && comboCount % 10 === 0) { vibrate("medium"); flashScreen(); }
  else if (comboCount >= 5 && comboCount % 5 === 0) { vibrate("light"); }

  clearTimeout(comboTimer);
  comboTimer = setTimeout(function() { comboCount = 0; dom.comboDisplay.style.opacity = "0"; }, 800);

  pet.hearts += 1;
  pet.clicks += 1;
  game.hearts += 1;
  game.stats.totalClicks += 1;

  spawnFloatingHeart(event);
  animatePetBounce(comboCount);
  checkLevelUp();
  renderActivePet();
  saveGame(game);
}

function checkLevelUp(petId) {
  var pet = petId ? game.pets[petId] : game.pets[game.activePet];
  while (true) {
    if (pet.level >= 120) break;
    var needed = heartsForNextLevel(pet.stage + 1, pet.level);
    if (pet.hearts < needed) break;
    pet.hearts -= needed;
    pet.level++;
    var newStage = getStageForLevel(pet.level);
    if (newStage > pet.stage) {
      pet.stage = newStage;
      game.stats.totalEvolved++;
      triggerEvolutionAnimation();
      var newUnlocks = checkNewUnlocks(game.pets);
      for (var i = 0; i < newUnlocks.length; i++) {
        (function(petId) {
          setTimeout(function() {
            showToast("🎉 解锁 " + PET_TYPES[petId].name + "！", 3000);
          }, 2000);
        })(newUnlocks[i]);
      }
      return;
    }
  }
}

// ===== 进化动画 =====

function triggerEvolutionAnimation() {
  isEvolving = true;
  vibrate("heavy");
  dom.evolveEmoji.textContent = getStageEmoji(game.activePet, game.pets[game.activePet].stage);
  dom.evolveName.textContent = getStageName(game.activePet, game.pets[game.activePet].stage);
  dom.evolveOverlay.classList.add("active");
  spawnBurstParticles();
  setTimeout(function() {
    dom.evolveOverlay.classList.remove("active");
    isEvolving = false;
    renderAll();
    saveGame(game);
  }, 2500);
}

// ===== 切换宠物 =====

function switchPet(petId) {
  if (isEvolving) return;
  if (!game.pets[petId] || !game.pets[petId].unlocked) return;
  game.activePet = petId;
  comboCount = 0;
  dom.comboDisplay.style.opacity = "0";
  renderAll();
  saveGame(game);
}

// ===== 广告 =====

function showAd() {
  if (isEvolving) {
    showToast("进化中，请稍后...", 1500);
    return;
  }
  if (adCooldown) {
    showToast("⏳ 请稍等片刻", 1000);
    return;
  }
  adCooldown = true;
  dom.adBtn.disabled = true;
  
  var adPetId = game.activePet;

  function finishCooldown() {
    if (dom.adBtn._cooling) return;
    dom.adBtn._cooling = true;
    var sec = 5;
    dom.adBtn.textContent = "⏳ " + sec + "s";
    var timer = setInterval(function() {
      sec--;
      if (sec <= 0) {
        clearInterval(timer);
        dom.adBtn.disabled = false;
        dom.adBtn.textContent = "📺 领取 500 爱心";
        adCooldown = false;
        dom.adBtn._cooling = false;
      } else {
        dom.adBtn.textContent = "⏳ " + sec + "s";
      }
    }, 1000);
  }
  showRewardAd(
    function() {
      var rewardPetId = (game.activePet === adPetId) ? adPetId : game.activePet;
      game.pets[rewardPetId].hearts += 500;
      game.hearts += 500;
      game.stats.totalAds++;
      showToast("💰 +500 爱心！", 2000);
      vibrate("success");
      checkLevelUp(rewardPetId);
      renderActivePet();
      saveGame(game);
      finishCooldown();
    },
    function(err) {
      showToast("📡 广告暂时不可用，请稍后再试", 2000);
      finishCooldown();
    }
  );
}

// ===== 特效 =====

function spawnFloatingHeart(event) {
  var rect = dom.petArea.getBoundingClientRect();
  var x, y;
  if (event && event.clientX) {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  } else {
    x = rect.width / 2 + Math.random() * 60 - 30;
    y = rect.height / 2 + Math.random() * 60 - 30;
  }
  var el = document.createElement("div");
  el.className = "float-heart";
  el.textContent = "+1";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.color = "hsl(" + Math.floor(Math.random() * 60 + 340) + ", 80%, 55%)";
  dom.floatContainer.appendChild(el);
  setTimeout(function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 800);
}

function animatePetBounce(combo) {
  var scale = combo >= 10 ? 1.15 : combo >= 5 ? 1.08 : 1.05;
  dom.petEmoji.style.transform = "scale(" + scale + ") translateY(-8px)";
  setTimeout(function() {
    dom.petEmoji.style.transform = "scale(1) translateY(0)";
  }, 100);
}

function flashScreen() {
  var el = document.createElement("div");
  el.className = "combo-flash";
  document.body.appendChild(el);
  setTimeout(function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 300);
}

function spawnBurstParticles() {
  var colors = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE", "#82E0AA", "#F8C471"];
  for (var i = 0; i < 40; i++) {
    var p = document.createElement("div");
    p.className = "burst-particle";
    var angle = Math.random() * Math.PI * 2;
    var d = 80 + Math.random() * 150;
    p.style.setProperty("--dx", Math.cos(angle) * d + "px");
    p.style.setProperty("--dy", Math.sin(angle) * d + "px");
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (0.8 + Math.random() * 0.8) + "s";
    dom.evolveOverlay.appendChild(p);
    setTimeout(function() {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 2000);
  }
}

// ===== Toast & 统计 =====

function showToast(msg, duration) {
  duration = duration || 2000;
  dom.toast.textContent = msg;
  dom.toast.classList.add("show");
  clearTimeout(dom.toast._timer);
  dom.toast._timer = setTimeout(function() {
    dom.toast.classList.remove("show");
  }, duration);
}

function showStats() {
  var s = game.stats;
  var totalPets = Object.keys(game.pets).filter(function(k) { return game.pets[k].unlocked; }).length;
  var msg = "🐾 已解锁: " + totalPets + "/18 | 总点击: " + formatNumber(s.totalClicks) +
    " | 进化: " + s.totalEvolved + "次 | 广告: " + s.totalAds + "次";
  showToast(msg, 3500);
}

// ===== 工具 =====

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return Math.floor(n).toString();
}

// ===== 暴露全局 =====

window.init = init;
window.handlePetClick = handlePetClick;
window.switchPet = switchPet;
window.showAd = showAd;
window.showStats = showStats;
