// ===== ClickPet — Telegram WebApp Wrapper =====

var tgApp = null;

function initTG() {
  if (window.Telegram && window.Telegram.WebApp) {
    tgApp = window.Telegram.WebApp;
    tgApp.expand();
    tgApp.ready();
    applyTgTheme();
    tgApp.onEvent("themeChanged", applyTgTheme);
    return true;
  }
  console.info("ClickPet: Not running inside Telegram");
  return false;
}

function applyTgTheme() {
  if (!tgApp) return;
  var root = document.documentElement;
  root.classList.toggle("dark", tgApp.colorScheme === "dark");
  if (tgApp.themeParams) {
    var tp = tgApp.themeParams;
    if (tp.bg_color) root.style.setProperty("--tg-bg", tp.bg_color);
    if (tp.text_color) root.style.setProperty("--tg-text", tp.text_color);
    if (tp.hint_color) root.style.setProperty("--tg-hint", tp.hint_color);
    if (tp.button_color) root.style.setProperty("--tg-btn", tp.button_color);
    if (tp.button_text_color) root.style.setProperty("--tg-btn-text", tp.button_text_color);
    if (tp.secondary_bg_color) root.style.setProperty("--tg-bg2", tp.secondary_bg_color);
    if (tp.link_color) root.style.setProperty("--tg-link", tp.link_color);
  }
}

function vibrate(type) {
  if (!tgApp || !tgApp.HapticFeedback) return;
  try {
    if (type === "light") tgApp.HapticFeedback.impactOccurred("light");
    else if (type === "medium") tgApp.HapticFeedback.impactOccurred("medium");
    else if (type === "heavy") tgApp.HapticFeedback.impactOccurred("heavy");
    else if (type === "success") tgApp.HapticFeedback.notificationOccurred("success");
  } catch (e) {}
}
