document.addEventListener("DOMContentLoaded", () => {

    const checkManager = setInterval(() => {
        if (window.AdsManager && AdsManager.currentProvider) {
            clearInterval(checkManager);
            console.log("[BannerAuto] Hiện banner từ:", AdsManager.currentProvider.toUpperCase());
            AdsManager.showBanner();
        }
    }, 300);

    setTimeout(() => clearInterval(checkManager), 15000);
});