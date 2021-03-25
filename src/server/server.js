const http = require("http");
const Router = require("./router");

const port = 5000;
const host = "localhost";

const router = new Router();

http.createServer(router.requestHandler.bind(router)).listen(port, host, () =>
    console.log(`Server started on ${host}:${port}`)
);

router.post("/api/generate", (req, res) => {
    let data = req.body;
    let points = generatePoints(data);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.end(JSON.stringify(points));
});

function generatePoints(data) {
    let { numberPoints, width, height, pointSize } = data;
    let arrayPoints = [];

    while (numberPoints) {
        const x = getRandomNumber(pointSize, width - pointSize);
        const y = getRandomNumber(pointSize, height - pointSize);
        arrayPoints.push({ x, y });
        numberPoints--;
    }
    return arrayPoints;
}

function getRandomNumber(min, max) {
    return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
}
