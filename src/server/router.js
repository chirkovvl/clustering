const url = require("url");

class Router {
    constructor() {
        this.urlHandlers = new Map();
    }

    requestHandler(req, res) {
        this.response = res;
        this.request = req;

        const pathname = url.parse(req.url).pathname;

        if (this.urlHandlers.has(pathname)) {
            let handler = this.urlHandlers.get(pathname);

            if (handler.method === req.method.toLowerCase()) {
                handler.parseBody(req).then((body) => {
                    req.body = body;
                    handler.callback(req, res);
                });
            } else {
                this._error(
                    405,
                    `CLIENT ERROR 405. ${req.method} method not allowed`
                );
            }
        } else {
            this._error(404, "CLIENT ERROR: 404. Page not found.");
        }
    }

    post(pathname, callback) {
        const parseBody = (req) => {
            return new Promise((resolve, reject) => {
                let body = "";
                try {
                    req.on("data", (chunk) => {
                        body += chunk.toString();
                    });

                    req.on("end", () => {
                        resolve(body);
                    });
                } catch {
                    reject(new Error(`Error parse body in ${pathname}`));
                }
            }).then((body) => {
                console.info(`Recived data on ${pathname}: ${body}`);
                return JSON.parse(body);
            });
        };

        let handlerData = {
            callback,
            parseBody,
            method: "post",
        };
        this.urlHandlers.set(pathname, handlerData);
    }

    get(pathname, callback) {
        const parseBody = (req) => {
            console.log("Парсим body для GET request");
        };

        let handlerData = {
            callback,
            parseBody,
        };

        this.urlHandlers.set(pathname, handlerData);
    }

    _error(code, errorMessage) {
        this.response.statusCode = code;
        this.response.setHeader("Content-Type", "text/plain;charset=utf-8");
        this.response.end(errorMessage);
    }
}

module.exports = Router;
