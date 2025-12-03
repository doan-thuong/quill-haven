class BannerManager {
    static init() {
        if (!APPLOVIN_CONFIG.ADS.BANNER.enabled || !window.applovinReady) return;

        Max.createBanner({
            adUnitId: APPLOVIN_CONFIG.ADS.BANNER.adUnitId,
            position: APPLOVIN_CONFIG.ADS.BANNER.position
        });

        console.log("Banner đã được tạo:", APPLOVIN_CONFIG.ADS.BANNER.position);

        Max.showBanner(APPLOVIN_CONFIG.ADS.BANNER.adUnitId);
    }

    static destroy() {
        if (APPLOVIN_CONFIG.ADS.BANNER.enabled && window.Max) {
            Max.hideBanner(APPLOVIN_CONFIG.ADS.BANNER.adUnitId);
            Max.destroyBanner(APPLOVIN_CONFIG.ADS.BANNER.adUnitId);
        }
    }
}

window.addEventListener("applovin-sdk-ready", BannerManager.init);