async function initAdmob() {
    if (!window.ADS_CONTROLLER.admob) return Promise.reject("AdMob tắt");

    return new Promise((resolve, reject) => {
        if (!window.admob) {
            const script = document.createElement('script');
            script.src = "https://afd.admob.com/v2/static/admob.js";
            script.onload = () => {
                window.admob?.init({ appId: ADS_CONFIG.admob.appId, testMode: ADS_CONFIG.debug })
                    .then(resolve).catch(reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        } else {
            resolve();
        }
    });
}

function showAdmobBanner() {
    window.admob?.banner.show({ adId: ADS_CONFIG.admob.bannerId, position: "bottom" });
}

async function showAdmobRewarded() {
    return new Promise((resolve, reject) => {
        window.admob?.rewarded.show({
            adId: ADS_CONFIG.admob.rewardedId,
            onRewarded: () => { AdsManager.grantReward(); resolve(); },
            onDismissed: () => { AdsManager.denyReward(); resolve(); },
            onFailed: () => reject()
        });
    });
}

window.initAdmob = initAdmob;
window.showAdmobBanner = showAdmobBanner;
window.showAdmobRewarded = showAdmobRewarded;