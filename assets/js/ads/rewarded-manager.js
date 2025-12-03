class RewardedManager {
    static isLoading = false;
    static callbackOnComplete = null;

    static preload() {
        if (!APPLOVIN_CONFIG.ADS.REWARDED.enabled || !window.applovinReady) return;

        Max.createRewarded({
            adUnitId: APPLOVIN_CONFIG.ADS.REWARDED.adUnitId
        });

        Max.loadRewarded(APPLOVIN_CONFIG.ADS.REWARDED.adUnitId);
    }

    static show(onComplete) {
        if (this.isLoading || !window.applovinReady) {
            alert("Quảng cáo đang tải, vui lòng đợi...");
            return;
        }

        const adUnitId = APPLOVIN_CONFIG.ADS.REWARDED.adUnitId;

        if (Max.isRewardedReady(adUnitId)) {
            this.callbackOnComplete = onComplete;
            Max.showRewarded(adUnitId);
        } else {
            this.isLoading = true;
            alert("Đang tải quảng cáo thưởng...");

            Max.loadRewarded(adUnitId);

            const checkInterval = setInterval(() => {
                if (Max.isRewardedReady(adUnitId)) {
                    clearInterval(checkInterval);
                    this.isLoading = false;
                    this.callbackOnComplete = onComplete;
                    Max.showRewarded(adUnitId);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(checkInterval);
                this.isLoading = false;
            }, 15000);
        }
    }
}

window.addEventListener("applovin-sdk-ready", () => {
    const adUnitId = APPLOVIN_CONFIG.ADS.REWARDED.adUnitId;

    Max.addEventListener("OnRewardedAdLoadedEvent", () => console.log("Rewarded loaded"));
    Max.addEventListener("OnRewardedAdLoadFailedEvent", () => console.log("Rewarded load failed"));

    Max.addEventListener("OnRewardedAdDisplayedEvent", () => console.log("Rewarded hiển thị"));
    Max.addEventListener("OnRewardedAdHiddenEvent", () => {

        if (RewardedManager.callbackOnComplete) {
            RewardedManager.callbackOnComplete(true);
            RewardedManager.callbackOnComplete = null;
        }
    });

    Max.addEventListener("OnRewardedAdReceivedRewardEvent", () => {
        console.log("Người dùng được thưởng!");
    });

    RewardedManager.preload();
});

Max.addEventListener("OnRewardedAdReceivedRewardEvent", (adInfo) => {
    console.log("User earned reward!");
    window.dispatchEvent(new Event('applovin_reward_granted'));

    if (RewardedManager.callbackOnComplete) {
        RewardedManager.callbackOnComplete(true);
        RewardedManager.callbackOnComplete = null;
    }
});

Max.addEventListener("OnRewardedAdHiddenEvent", (adInfo) => {
    if (!adInfo.hasRewardBeenGranted) { // <<<< quan trọng nhất
        console.log("User skipped or closed early → no reward");
        if (RewardedManager.callbackOnComplete) {
            RewardedManager.callbackOnComplete(false);
        }
    }
});