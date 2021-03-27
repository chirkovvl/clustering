class Router {
    constructor() {
        this.urlHandlers = {};
    }

    requestHandler(req, res) {
        this.response = res;
        this.request = req;

        this.url = new URL(req.url, `http://${req.headers.host}`);
        let pathname = this.url.pathname;

        if (pathname in this.urlHandlers) {
            let handlers = this.urlHandlers[pathname];
            if (req.method.toLowerCase() in handlers) {
                let methodObject = handlers[req.method.toLowerCase()];

                methodObject.parseBody(req).then((data) => {
                    req.body = data;
                    methodObject.callbacks.forEach((callback) =>
                        callback(req, res)
                    );
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
            return this._promisify(pathname, req.method, () => {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                return new Promise((resolve) => {
                    req.on("end", () => resolve(body));
                });
            });
        };

        if (this.urlHandlers[pathname] === undefined) {
            this.urlHandlers[pathname] = {};
        }

        if (this.urlHandlers[pathname].post === undefined) {
            this.urlHandlers[pathname].post = {
                callbacks: [callback],
                parseBody,
            };
        } else {
            this.urlHandlers[pathname].post.callbacks.push(callback);
        }
    }

    get(pathname, callback) {
        const parseBody = (req) => {
            return this._promisify(pathname, req.method, () => {
                let requestParams = this.url.search;
                let arrParams = requestParams.slice(1).split(/[?]|[&]/);
                let body = {};
                arrParams.forEach((param) => {
                    let [key, value] = param.split("=");
                    body[key] = value;
                });
                return JSON.stringify(body);
            });
        };

        if (this.urlHandlers[pathname] === undefined) {
            this.urlHandlers[pathname] = {};
        }

        if (this.urlHandlers[pathname].get === undefined) {
            this.urlHandlers[pathname].get = {
                callbacks: [callback],
                parseBody,
            };
        } else {
            this.urlHandlers[pathname].get.callbacks.push(callback);
        }
    }

    _promisify(pathname, method, func) {
        return new Promise((resolve, reject) => {
            try {
                let result = func();
                resolve(result);
            } catch {
                reject(
                    new Error(
                        `Error parse body pathname: ${pathname} method: ${method}`
                    )
                );
            }
        }).then((result) => {
            console.info(
                `${method}: Recived data on ${pathname}\ndata: ${result}`
            );
            return JSON.parse(result);
        });
    }

    _error(code, errorMessage) {
        this.response.statusCode = code;
        this.response.setHeader("Content-Type", "text/plain;charset=utf-8");
        this.response.end(errorMessage);
    }
}

module.exports = Router;
