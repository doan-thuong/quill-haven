const ADS_CONFIG = {
    applovin: {
        sdkKey: "YOUR_APPLOVIN_SDK_KEY",
        bannerId: "YOUR_APPLOVIN_BANNER_ID",
        rewardedId: "YOUR_APPLOVIN_REWARDED_ID"
    },

    admob: {
        appId: "ca-app-pub-xxx~yyyyyyyy",           // Android
        appIdIos: "ca-app-pub-xxx~zzzzzzzz",       // iOS (nếu có)
        bannerId: "ca-app-pub-xxx/1111111111",
        rewardedId: "ca-app-pub-xxx/2222222222"
    },

    topon: {
        appId: "YOUR_TOPON_APP_ID",
        appKey: "YOUR_TOPON_APP_KEY",
        bannerPlacement: "your_banner_placement",
        rewardedPlacement: "your_rewarded_placement"
    },

    // Cấu hình chung
    debug: true, // bật log để test
    maxRewardedPerSession: 6,
    sessionMinutes: 30
};

window.ADS_CONFIG = ADS_CONFIG;