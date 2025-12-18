// assets/js/adsense-manager.js
class AdsManager {
    static init() {
        console.log("AdSense Manager khởi động");

        // Load AdSense SDK (chỉ load 1 lần)
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        }

        // Tự động hiện banner ở footer
        // this.showBanner();
    }

    static showBanner() {
        const banner = document.createElement('div');
        banner.innerHTML = `
            <ins class="adsbygoogle"
                style="display:block; text-align:center;"
                data-ad-client="${ADSENSE_CONFIG.clientId}"
                data-ad-slot="${ADSENSE_CONFIG.bannerSlot}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        `;
        document.body.appendChild(banner);
        (adsbygoogle = window.adsbygoogle || []).push({});
        console.log("Banner AdSense đã hiển thị");
    }

    static showInterstitialAsRewarded(callback) {
        return
        const interstitial = document.createElement('div');
        interstitial.innerHTML = `
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="${ADSENSE_CONFIG.clientId}"
                data-ad-slot="${ADSENSE_CONFIG.interstitialSlot}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        `;
        document.body.appendChild(interstitial);
        (adsbygoogle = window.adsbygoogle || []).push({});

        // Giả lập "xem xong quảng cáo" sau 5–8 giây (AdSense không có callback thật)
        const minTime = 5000;
        const maxTime = 8000;
        const watchTime = Math.random() * (maxTime - minTime) + minTime;

        setTimeout(() => {
            window.dispatchEvent(new Event('reward_granted')); // cho ads-safety.js vẫn dùng được
            callback?.(true);
            console.log("AdSense Interstitial: Người dùng được thưởng");
        }, watchTime);
    }
}

document.addEventListener("DOMContentLoaded", () => AdsManager.init());
window.AdsManager = AdsManager;