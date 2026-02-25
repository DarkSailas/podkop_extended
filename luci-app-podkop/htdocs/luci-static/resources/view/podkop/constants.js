"use strict";

"require baseclass";

return baseclass.extend({
    PKG_NAME: "podkop",
    VERSION: "__COMPILED_VERSION_VARIABLE__",
    GITHUB_URL: "https://github.com/DarkSailas/podkop_extended",

    DNS_SERVER_OPTIONS: {
        "8.8.8.8": "Google DNS (8.8.8.8)",
        "1.1.1.1": "Cloudflare DNS (1.1.1.1)",
        "77.88.8.8": "Yandex DNS (77.88.8.8)",
        "9.9.9.9": "Quad9 DNS (9.9.9.9)"
    },

    BOOTSTRAP_DNS_SERVER_OPTIONS: {
        "8.8.8.8": "Google DNS (8.8.8.8)",
        "1.1.1.1": "Cloudflare DNS (1.1.1.1)",
        "77.88.8.8": "Yandex DNS (77.88.8.8)"
    },

    UPDATE_INTERVAL_OPTIONS: {
        "1h": "Every hour",
        "6h": "Every 6 hours",
        "12h": "Every 12 hours",
        "1d": "Every day",
        "1w": "Every week"
    }
});
