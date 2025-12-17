const ADS_CONFIG = {
    applovin: {
        sdkKey: "YOUR_APPLOVIN_SDK_KEY",
        bannerId: "YOUR_APPLOVIN_BANNER_ID",
        rewardedId: "YOUR_APPLOVIN_REWARDED_ID"
    },

    admob: {
        appId: "ca-app-pub-1571883208341918~4845312734",           // Android
        appIdIos: "ca-app-pub-xxx~zzzzzzzz",       // iOS (nếu có)
        bannerId: "ca-app-pub-1571883208341918/7648952931",
        rewardedId: "ca-app-pub-1571883208341918/3764891703"
    },

    // Cấu hình chung
    debug: true, // bật log để test
    maxRewardedPerSession: 6,
    sessionMinutes: 30
};

const ADSENSE_CONFIG = {
    clientId: "ca-pub-1571883208341918",
    bannerSlot: "1234567890",
    interstitialSlot: "0987654321",
    debug: true
};

window.ADSENSE_CONFIG = ADSENSE_CONFIG;
// window.ADS_CONFIG = ADS_CONFIG;