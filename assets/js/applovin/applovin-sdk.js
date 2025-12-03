(function () {
    const config = APPLOVIN_CONFIG;

    (function (s, d, u) {
        const a = d.createElement(s);

        a.src = u + "?sdk_key=" + config.SDK_KEY;
        a.async = true;
        d.head.appendChild(a);
    })("script", document, "https://assets.applovin.com/max/js/max.js");

    window.applovinReady = false;

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (window.Max) {
                window.Max.initialize(config.SDK_KEY, () => {
                    console.log("AppLovin MAX SDK đã sẵn sàng");

                    window.applovinReady = true;

                    window.dispatchEvent(new Event("applovin-sdk-ready"));
                });
            }
        }, 1000);
    });
})();