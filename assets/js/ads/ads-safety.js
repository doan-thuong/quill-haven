// === ANTI-FRAUD & POLICY COMPLIANCE FOR APPLOVIN MAX ===
class AdsSafety {
    static init() {
        // this.blockBadUsers();
        this.preventAutoClick();
        this.limitRewardedPerSession();
        this.delayFirstShow();
        this.addUserEngagementCheck();
    }

    // 1. Chặn bot, VPN, datacenter IP (AppLovin rất ghét)
    //   static blockBadUsers() {
    //     fetch('https://www.cloudflare.com/cdn-cgi/trace')
    //       .then(r => r.text())
    //       .then(data => {
    //         if (data.includes('colo=')) {
    //           const isBot = /bot|headless|phantom|slurp|spider|crawl|ahrefs|semrush/i.test(navigator.userAgent);
    //           const isVpn = data.includes('colo=') && !data.includes('visit_scheme=https');
    //           if (isBot || data.includes('loc=XX')) {
    //             APPLOVIN_CONFIG.ADS.BANNER.enabled = false;
    //             APPLOVIN_CONFIG.ADS.REWARDED.enabled = false;
    //             console.warn("Blocked suspicious user");
    //           }
    //         }
    //       });
    //   }

    // 2. Không cho click liên tục trong < 3 giây (rất dễ bị flag invalid click)
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

    // 3. Giới hạn tối đa 6 rewarded video mỗi phiên (30 phút)
    static limitRewardedPerSession() {
        const KEY = 'applovin_reward_count';
        const TIME_KEY = 'applovin_session_time';
        const now = Date.now();

        let count = parseInt(localStorage.getItem(KEY) || '0');
        const sessionTime = parseInt(localStorage.getItem(TIME_KEY) || '0');

        // Reset lại sau 30 phút
        if (now - sessionTime > 30 * 60 * 1000) {
            count = 0;
            localStorage.setItem(TIME_KEY, now);
        }

        if (count >= 6) {
            APPLOVIN_CONFIG.ADS.REWARDED.enabled = false;
            document.getElementById('next-phase').textContent = "Waiting";
            console.warn("Rewarded limit reached for this session");
        } else {
            window.rewardCount = count;
        }

        // Tăng count khi được thưởng
        window.addEventListener('applovin_reward_granted', () => {
            count++;
            localStorage.setItem(KEY, count);
        });
    }

    // 4. Không hiện quảng cáo trong 8 giây đầu tiên (rất quan trọng!)
    static delayFirstShow() {
        const startTime = Date.now();
        const originalShow = RewardedManager.show;
        RewardedManager.show = function (...args) {
            if (Date.now() - startTime < 8000) {
                // alert("Vui lòng đọc truyện một chút trước khi xem quảng cáo nhé!");
                const onComplete = args[0];
                if (onComplete) onComplete(false);
                return;
            }
            originalShow.apply(this, args);
        };
    }

    // 5. Chỉ cho xem rewarded khi người dùng thực sự tương tác với nội dung
    static addUserEngagementCheck() {
        let scrolled = false;
        let timeSpent = 0;
        setInterval(() => timeSpent += 5, 5000);

        window.addEventListener('scroll', () => scrolled = true, { once: true });

        const originalShow = RewardedManager.show;
        RewardedManager.show = function (onComplete) {
            if (timeSpent < 15 || !scrolled) {
                // alert("Hãy đọc truyện một chút để mở khóa phần tiếp theo nhé!");
                onComplete(false);
                return;
            }
            originalShow.call(this, onComplete);
        };
    }
}

// Khởi chạy ngay khi SDK sẵn sàng
window.addEventListener("applovin-sdk-ready", () => {
    AdsSafety.init();
});