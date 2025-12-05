async function initApplovin() {
    if (!window.ADS_CONTROLLER.applovin) return Promise.reject("AppLovin bị tắt");

    return new Promise((resolve, reject) => {
        // Load SDK nếu chưa load
        if (!document.querySelector('script[src*="applovin"]')) {
            const script = document.createElement('script');
            script.src = `https://assets.applovin.com/max/js/max.js?sdk_key=${ADS_CONFIG.applovin.sdkKey}`;
            script.async = true;
            document.head.appendChild(script);
        }

        const checkMax = setInterval(() => {
            if (window.Max) {
                clearInterval(checkMax);
                window.Max.initialize(ADS_CONFIG.applovin.sdkKey, () => {
                    console.log("AppLovin MAX SDK đã sẵn sàng");

                    Max.createBanner({
                        adUnitId: ADS_CONFIG.applovin.bannerId,
                        position: "bottom"
                    });

                    Max.createRewarded({
                        adUnitId: ADS_CONFIG.applovin.rewardedId
                    });

                    Max.loadRewarded(ADS_CONFIG.applovin.rewardedId);

                    // === Các event quan trọng ===
                    Max.addEventListener("OnRewardedAdLoadedEvent", () => console.log("AppLovin: Rewarded loaded"));
                    Max.addEventListener("OnRewardedAdLoadFailedEvent", () => console.warn("AppLovin: Rewarded load failed"));

                    Max.addEventListener("OnRewardedAdReceivedRewardEvent", () => {
                        console.log("AppLovin: Người dùng được thưởng!");
                        AdsManager.grantReward();
                    });

                    Max.addEventListener("OnRewardedAdHiddenEvent", (adInfo) => {
                        if (!adInfo?.hasRewardBeenGranted) {
                            console.log("AppLovin: Đóng sớm → không thưởng");
                            AdsManager.denyReward();
                        }
                    });

                    resolve();
                });
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkMax);
            reject("AppLovin timeout");
        }, 15000);
    });
}

function showApplovinBanner() {
    if (window.Max && ADS_CONFIG.applovin.bannerId) {
        Max.showBanner(ADS_CONFIG.applovin.bannerId);
    }
}

async function showApplovinRewarded() {
    if (!window.Max) throw new Error("Max SDK chưa load");

    const adUnitId = ADS_CONFIG.applovin.rewardedId;

    if (Max.isRewardedReady(adUnitId)) {
        Max.showRewarded(adUnitId);
    } else {
        Max.loadRewarded(adUnitId);

        return new Promise((resolve, reject) => {
            const check = setInterval(() => {
                if (Max.isRewardedReady(adUnitId)) {
                    clearInterval(check);
                    Max.showRewarded(adUnitId);
                    resolve();
                }
            }, 300);
            setTimeout(() => {
                clearInterval(check);
                reject("AppLovin rewarded timeout");
            }, 12000);
        });
    }
}

window.initApplovin = initApplovin;
window.showApplovinBanner = showApplovinBanner;
window.showApplovinRewarded = showApplovinRewarded;