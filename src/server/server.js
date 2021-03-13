const http = require("http");
const Router = require("./router");

const port = 5000;
const host = "localhost";

const router = new Router();

http.createServer(router.requestHandler.bind(router)).listen(port, host, () =>
    console.log(`Server started on ${host}:${port}`)
);

router.to("/api/generate_points", (req, res) => {
    if (req.method == "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            let data = JSON.parse(body);
            let points = generatePoints(data);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json;charset=utf-8");
            res.end(JSON.stringify(points));
        });

        function generatePoints(data) {
            let { numberPoints, canvasWidth, canvasHeight, pointSize } = data;

            let arrayPoints = [];

            function getRandomNumber(min, max) {
                return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
            }

            while (numberPoints) {
                const x = getRandomNumber(pointSize, canvasWidth - pointSize);
                const y = getRandomNumber(pointSize, canvasHeight - pointSize);

                arrayPoints.push({ x, y });
                numberPoints--;
            }

            return arrayPoints;
        }
    }

    if (req.method == "GET") {
        res.setHeader("Content-Type", "text/plain;charset=utf-8");
        res.end("Только POST");
    }
});
