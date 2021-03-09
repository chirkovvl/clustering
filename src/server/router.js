const url = require("url");

class Router {
    constructor() {
        this.urlHandlers = new Map();
    }

    requestHandler(req, res) {
        const pathname = url.parse(req.url).pathname;

        if (this.urlHandlers.has(pathname)) {
            this.urlHandlers.get(pathname)(req, res);
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain;charset=utf-8");
            res.end("Error: 404. This page does not exist.");
        }
    }

    to(pathname, callback) {
        this.urlHandlers.set(pathname, callback);
    }
}

module.exports = Router;
