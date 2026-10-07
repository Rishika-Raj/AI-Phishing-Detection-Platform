function validateURL(url) {
    try {
        const parsedURL = new URL(url);

        if (!["http:", "https:"].includes(parsedURL.protocol)) {
            return {
                valid: false,
                message: "Only HTTP and HTTPS URLs are allowed"
            };
        }

        if (!parsedURL.hostname) {
            return {
                valid: false,
                message: "URL must contain a hostname"
            };
        }

        return {
            valid: true,
            message: "Valid URL"
        };

    } catch (error) {
        return {
            valid: false,
            message: "Invalid URL format"
        };
    }
}

module.exports = {
    validateURL
};