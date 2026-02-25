"use strict";

function validateIPV4(ip) {
    const ipRegex = /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
    return ipRegex.test(ip);
}

function validateDomain(domain) {
    const domainRegex = /^(?=.{1,253}(?:\/|$))(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9-]{1,59}[a-zA-Z0-9])(?:\/[^\s]*)?$/;
    return domainRegex.test(domain);
}

function validateDNS(value) {
    if (!value) return false;
    const cleaned = value.split(":")[0].split("/")[0];
    return validateIPV4(cleaned) || validateDomain(cleaned);
}

return {
    ipv4: validateIPV4,
    domain: validateDomain,
    dns: validateDNS
};
