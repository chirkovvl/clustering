const http = require("http");
const Router = require("./router");
const fe = require("fast-equals");

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
    let points = data.points;
    let clusters = data.centersGravity;
    let states = [];

    while (true) {
        let state = calcState(points, clusters);

        if (states.length) {
            if (fe.deepEqual(state, states[states.length - 1])) break;
        }

        states.push(state);
        let coords = calcClustersCoords(state);
        setClustersCoords(clusters, coords);
    }

    return states;
}

function setClustersCoords(clusters, coords) {
    clusters.forEach((cluster, index) => {
        cluster.x = coords[index].x;
        cluster.y = coords[index].y;
    });
}

function calcClustersCoords(state) {
    let coords = {};

    for (let cluster in state) {
        if (state.hasOwnProperty(cluster)) {
            let length = state[cluster].points.length;
            let points = state[cluster].points;
            let [avgX, avgY] = points
                .reduce(
                    ([sumX, sumY], item) => [sumX + item.x, sumY + item.y],
                    [0, 0]
                )
                .map((sum) => Math.floor(sum / length));

            coords[cluster] = { x: avgX, y: avgY };
        } else {
            throw new Error(`Object state doesn't contain property ${cluster}`);
        }
    }

    return coords;
}

function calcState(points, clusters) {
    let state = {};

    for (let point of points) {
        let distances = clusters.map((cluster) =>
            distanceBetween(point.x, point.y, cluster.x, cluster.y)
        );

        let index = indexCluster(distances);

        if (state[index] === undefined) {
            state[index] = {
                x: clusters[index].x,
                y: clusters[index].y,
                points: [],
            };
        }

        state[index].points.push(point);
    }

    return state;
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

function indexCluster(arr) {
    try {
        let minDistance = Math.min.apply(null, arr);
        return arr.indexOf(minDistance);
    } catch {
        throw new Error(`Failed to calculate the cluster index`);
    }
}

function randomNumber(min, max) {
    return Math.floor(min - 0.5 + Math.random() * (max - min + 1));
}

function distanceBetween(fromX, fromY, toX, toY) {
    return Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
}
