class AdsManager {
    static currentProvider = null;     // Nhà cung cấp đang hoạt động
    static rewardedCallback = null;
    static isLoadingRewarded = false;
    static activeProviders = [];

    static async init() {
        if (!window.ADS_CONFIG || !window.ADS_CONTROLLER) {
            console.error("Thiếu ads-config.js hoặc ads-controller.js");
            return;
        }

        if (ADS_CONTROLLER.emergencyOff) {
            console.warn("TẮT KHẨN CẤP – Không hiển thị quảng cáo nào");
            return;
        }

        // Lọc danh sách nhà cung cấp đang bật
        this.activeProviders = [];
        if (ADS_CONTROLLER.applovin) this.activeProviders.push({ name: "applovin", init: initApplovin });
        if (ADS_CONTROLLER.admob) this.activeProviders.push({ name: "admob", init: initAdmob });
        if (ADS_CONTROLLER.topon) this.activeProviders.push({ name: "topon", init: initTopon });

        if (this.activeProviders.length === 0) {
            console.warn("Tất cả nhà cung cấp đều bị tắt trong ads-controller.js");
            return;
        }

        for (const provider of this.activeProviders) {
            try {
                console.log(`[AdsManager] Đang khởi động ${provider.name.toUpperCase()}...`);
                await provider.init();
                this.currentProvider = provider.name;
                console.log(`[AdsManager] ĐANG DÙNG: ${provider.name.toUpperCase()}`);
                this.showBanner();
                return;
            } catch (err) {
                console.warn(`[AdsManager] ${provider.name} thất bại → thử tiếp theo`, err);
            }
        }

        console.error("[AdsManager] TẤT CẢ NHÀ CUNG CẤP ĐỀU LỖI!");
    }

    // Hiện banner (tự động dùng provider hiện tại)
    static showBanner() {
        if (!this.currentProvider) return;
        const funcName = `show${this.currentProvider.charAt(0).toUpperCase() + this.currentProvider.slice(1)}Banner`;
        if (typeof window[funcName] === "function") {
            window[funcName]();
        }
    }

    // Gọi rewarded – tự động fallback nếu lỗi
    static showRewarded(callback) {
        if (this.isLoadingRewarded || !this.currentProvider) {
            callback(false);
            return;
        }

        this.isLoadingRewarded = true;
        this.rewardedCallback = callback;

        const funcName = `show${this.currentProvider.charAt(0).toUpperCase() + this.currentProvider.slice(1)}Rewarded`;
        if (typeof window[funcName] === "function") {
            window[funcName]().catch(() => this.fallbackAndRetry());
        } else {
            this.fallbackAndRetry();
        }
    }

    // Fallback sang nhà cung cấp tiếp theo
    static fallbackAndRetry() {
        const currentIndex = this.activeProviders.findIndex(p => p.name === this.currentProvider);
        if (currentIndex < this.activeProviders.length - 1) {
            this.currentProvider = this.activeProviders[currentIndex + 1].name;
            console.log(`[AdsManager] Chuyển sang: ${this.currentProvider.toUpperCase()}`);
            setTimeout(() => this.showRewarded(this.rewardedCallback), 800);
        } else {
            console.warn("[AdsManager] Hết nhà cung cấp để thử!");
            this.isLoadingRewarded = false;
            if (this.rewardedCallback) this.rewardedCallback(false);
        }
    }

    // Gọi khi người dùng được thưởng (dù provider nào)
    static grantReward() {
        this.isLoadingRewarded = false;
        window.dispatchEvent(new Event('applovin_reward_granted'));
        window.dispatchEvent(new Event('reward_granted'));
        if (this.rewardedCallback) this.rewardedCallback(true);
    }

    static denyReward() {
        this.isLoadingRewarded = false;
        if (this.rewardedCallback) this.rewardedCallback(false);
    }
}

document.addEventListener("DOMContentLoaded", () => AdsManager.init());

window.AdsManager = AdsManager;