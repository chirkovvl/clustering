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
            let method = req.method.toLowerCase();

            if (method in handlers) {
                handlers[method].parseBody(req).then((data) => {
                    req.body = data;
                    res.json = this._json.bind(res);
                    handlers[method].callback(req, res);
                });
            } else {
                this._error(
                    405,
                    `CLIENT ERROR 405. ${req.method} method not allowed`
                );
            }
        } else {
            this._error(404, "CLIENT ERROR: 404. Resourse not found.");
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

        this._saveCallback(pathname, callback, parseBody, "post");
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

        this._saveCallback(pathname, callback, parseBody, "get");
    }

    _json(data) {
        this.statusCode = 200;
        this.setHeader("Content-Type", "application/json;charset=utf-8");
        this.end(JSON.stringify(data));
    }

    _saveCallback(path, callback, parseBody, method) {
        if (this.urlHandlers[path] === undefined) {
            this.urlHandlers[path] = {};
        }

        if (this.urlHandlers[path][method] === undefined) {
            this.urlHandlers[path][method] = {
                callback,
                parseBody,
            };
        } else {
            throw new Error(
                `Exceeded the number of callbacks for ${method}:${path}`
            );
        }
    }

    async _promisify(pathname, method, func) {
        const data = await new Promise((resolve, reject) => {
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
        });

        console.info(`${method}: Recived data on ${pathname}\ndata: ${data}`);

        return JSON.parse(data);
    }

    _error(code, errorMessage) {
        this.response.statusCode = code;
        this.response.setHeader("Content-Type", "text/plain;charset=utf-8");
        this.response.end(errorMessage);
    }
}

module.exports = Router;
