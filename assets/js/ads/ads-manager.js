// assets/js/ads-manager.js
class AdsManager {
    static currentProvider = null;
    static rewardedCallback = null;
    static isLoading = false;

    static async init() {
        if (ADS_CONTROLLER.emergencyOff) {
            console.warn("TẮT KHẨN CẤP! Không hiển thị quảng cáo");
            return;
        }

        const providers = [];
        if (ADS_CONTROLLER.applovin) providers.push({ name: "applovin", init: initApplovin });
        if (ADS_CONTROLLER.admob) providers.push({ name: "admob", init: initAdmob });

        for (const p of providers) {
            try {
                console.log(`[AdsManager] Khởi động ${p.name.toUpperCase()}...`);
                await p.init();
                this.currentProvider = p.name;
                console.log(`[AdsManager] ĐANG DÙNG: ${p.name.toUpperCase()}`);
                this.showBanner();
                return;
            } catch (err) {
                console.warn(`[AdsManager] ${p.name} lỗi → thử tiếp theo`, err);
            }
        }
        console.error("TẤT CẢ NHÀ CUNG CẤP ĐỀU LỖI!");
    }

    static showBanner() {
        if (!this.currentProvider) return;
        const func = window[`show${this.currentProvider.charAt(0).toUpperCase() + this.currentProvider.slice(1)}Banner`];
        func?.();
    }

    static showRewarded(callback) {
        if (this.isLoading || !this.currentProvider) return callback(false);
        this.isLoading = true;
        this.rewardedCallback = callback;

        const func = window[`show${this.currentProvider.charAt(0).toUpperCase() + this.currentProvider.slice(1)}Rewarded`];
        if (func) {
            func().catch(() => this.fallback());
        } else {
            this.fallback();
        }
    }

    static fallback() {
        const next = ADS_CONTROLLER.applovin && this.currentProvider === "applovin" ? "admob" :
            ADS_CONTROLLER.admob && this.currentProvider === "admob" ? null : null;

        if (next) {
            this.currentProvider = next;
            console.log(`[AdsManager] Chuyển sang: ${next.toUpperCase()}`);
            setTimeout(() => this.showRewarded(this.rewardedCallback), 800);
        } else {
            this.isLoading = false;
            this.rewardedCallback?.(false);
        }
    }

    static grantReward() {
        this.isLoading = false;
        window.dispatchEvent(new Event('applovin_reward_granted'));
        window.dispatchEvent(new Event('reward_granted'));
        this.rewardedCallback?.(true);
    }

    static denyReward() {
        this.isLoading = false;
        this.rewardedCallback?.(false);
    }
}

document.addEventListener("DOMContentLoaded", () => AdsManager.init());
window.AdsManager = AdsManager;