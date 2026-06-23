// ===== ClickPet — Adsgram Ad Module =====

var ADSGRAM_BLOCK_ID = "34698"; // replace with your own from partner.adsgram.ai
var adController = null;

function initAds() {
  if (adController) return adController;
  if (window.Adsgram) {
    try {
      adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
      console.log("ClickPet: Adsgram initialized");
      return adController;
    } catch (e) {
      console.warn("ClickPet: Adsgram init failed", e);
    }
  }
  console.warn("ClickPet: Adsgram SDK not loaded");
  return null;
}

function showRewardAd(onReward, onError) {
  if (!initAds()) {
    onError("sdk_unavailable");
    return;
  }

  adController.show()
    .then(function(result) { onReward(); })
    .catch(function(err) {
      console.warn("ClickPet: Ad error", err);
      onError("ad_error");
    });
}