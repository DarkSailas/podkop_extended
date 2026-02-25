"use strict";

"require baseclass";

return baseclass.extend({
    ipv4: function (ip) {
        const ipRegex = /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
        return ipRegex.test(ip);
    },

    domain: function (domain) {
        const domainRegex = /^(?=.{1,253}(?:\/|$))(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9-]{1,59}[a-zA-Z0-9])(?:\/[^\s]*)?$/;
        return domainRegex.test(domain);
    },

    dns: function (value) {
        if (!value) return false;
        const cleaned = value.split(":")[0].split("/")[0];
        return this.ipv4(cleaned) || this.domain(cleaned);
    }
});
