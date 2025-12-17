document.addEventListener("DOMContentLoaded", () => {
    const checkAdSense = setInterval(() => {
        if (window.adsbygoogle) {
            clearInterval(checkAdSense);

            const bannerContainer = document.createElement('div');
            bannerContainer.style.cssText = `
                text-align: center;
                margin: 40px auto;
                padding: 20px 0;
                max-width: 100%;
            `;

            bannerContainer.innerHTML = `
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="${ADSENSE_CONFIG.clientId}"
                    data-ad-slot="${ADSENSE_CONFIG.bannerSlot}"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            `;

            document.body.appendChild(bannerContainer);
            (adsbygoogle = window.adsbygoogle || []).push({});

            console.log("[BannerAuto] Banner AdSense đã hiển thị");
        }
    }, 300);

    // Timeout an toàn (nếu AdSense không load được trong 15s)
    setTimeout(() => clearInterval(checkAdSense), 15000);
});