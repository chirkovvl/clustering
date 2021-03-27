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
    const points = generatePoints(data);

    res.json(points);
});

router.post("/api/clustering", (req, res) => {
    let data = req.body;
    const result = clusteringData(data);

    res.json(result);
});

function clusteringData(data) {
    return { message: "Пока не реализовано" };
}

function generatePoints({ numberPoints, width, height, pointSize }) {
    let arrayPoints = [];

    while (numberPoints) {
        const x = randomNumber(pointSize, width - pointSize);
        const y = randomNumber(pointSize, height - pointSize);
        arrayPoints.push({ x, y });
        numberPoints--;
    }
    return arrayPoints;
}

function randomNumber(min, max) {
    return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
}
