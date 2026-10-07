function analyzeURL(url) {

    let score = 0;
    let reasons = [];

    const parsedURL = new URL(url);

    if (parsedURL.protocol !== "https:") {
        score += 20;
        reasons.push("URL does not use HTTPS");
    }

    const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

    if (ipPattern.test(parsedURL.hostname)) {
        score += 30;
        reasons.push("URL uses an IP address");
    }

    if (url.includes("@")) {
        score += 25;
        reasons.push("URL contains @ character");
    }

    if (url.length > 100) {
        score += 10;
        reasons.push("URL is unusually long");
    }

    return {
        score,
        reasons
    };
}

module.exports = {
    analyzeURL
};