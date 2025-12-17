// assets/js/ads-safety.js
class AdsSafety {
    static init() {
        this.preventAutoClick();
        this.limitRewardedPerSession();
        this.delayFirstShow();
        this.addUserEngagementCheck();
    }

    // 1. Không cho click liên tục < 3 giây
    static preventAutoClick() {
        let lastClick = 0;
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClick < 3000) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            lastClick = now;
        }, true);
    }

    // 2. Giới hạn tối đa 6 lần rewarded mỗi 30 phút (vẫn hoạt động với AdSense)
    static limitRewardedPerSession() {
        const KEY = 'adsense_reward_count';
        const TIME_KEY = 'adsense_session_time';
        const now = Date.now();

        let count = parseInt(localStorage.getItem(KEY) || '0');
        const sessionTime = parseInt(localStorage.getItem(TIME_KEY) || '0');

        // Reset sau 30 phút
        if (now - sessionTime > 30 * 60 * 1000) {
            count = 0;
            localStorage.setItem(TIME_KEY, now);
        }

        if (count >= 6) {
            const nextBtn = document.getElementById('next-phase');
            if (nextBtn) {
                nextBtn.disabled = true;
                nextBtn.textContent = "Hôm nay đã hết lượt xem quảng cáo";
            }
            console.warn("Đã đạt giới hạn 6 lần rewarded hôm nay");
            return;
        }

        // Tăng đếm khi được thưởng (AdSense dùng event mới)
        window.addEventListener('reward_granted', () => {
            count++;
            localStorage.setItem(KEY, count);
            console.log(`Đã xem quảng cáo lần ${count}/6`);
        });
    }

    // 3. Delay 8 giây đầu tiên
    static delayFirstShow() {
        const startTime = Date.now();
        const originalShow = window.AdSenseManager?.showInterstitialAsRewarded;
        if (originalShow) {
            window.AdSenseManager.showInterstitialAsRewarded = function (callback) {
                if (Date.now() - startTime < 8000) {
                    callback?.(false);
                    return;
                }
                originalShow.call(this, callback);
            };
        }
    }

    // 4. Yêu cầu scroll + thời gian đọc
    static addUserEngagementCheck() {
        let scrolled = false;
        let timeSpent = 0;
        setInterval(() => timeSpent += 5, 5000);
        window.addEventListener('scroll', () => scrolled = true, { once: true });

        const originalShow = window.AdSenseManager?.showInterstitialAsRewarded;
        if (originalShow) {
            window.AdSenseManager.showInterstitialAsRewarded = function (callback) {
                if (timeSpent < 15 || !scrolled) {
                    callback?.(false);
                    return;
                }
                originalShow.call(this, callback);
            };
        }
    }
}

// Khởi động khi trang load
document.addEventListener("DOMContentLoaded", () => AdsSafety.init());