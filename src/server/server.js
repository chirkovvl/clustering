const http = require("http");
const Router = require("./router");
const generatePoints = require("./lib/generate");
const clusteringData = require("./lib/clustering");

const port = 5000;
const host = "localhost";

const router = new Router();

http.createServer(router.requestHandler.bind(router)).listen(port, host, () =>
    console.log(`Server started on ${host}:${port}`)
);

router.post("/api/generate", (req, res) => {
    let data = req.body;
    const points = generatePoints(data);

    res.json(points);
});

router.post("/api/clustering", (req, res) => {
    let data = req.body;
    const result = clusteringData(data);
    console.info(`Number of states: ${result.length}`);

    res.json(result);
});
