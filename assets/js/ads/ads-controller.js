const ADS_CONTROLLER = {
    applovin: true,
    admob: false,
    topon: true,

    // Tự động tắt tất cả (dùng khi bảo trì hoặc test)
    emergencyOff: false   // ← đổi thành true → tắt sạch mọi quảng cáo (rất tiện!)
};

window.ADS_CONTROLLER = ADS_CONTROLLER;