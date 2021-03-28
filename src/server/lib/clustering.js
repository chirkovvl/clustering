const fe = require("fast-equals");

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

function calcClustersCoords(state) {
    let coords = {};

    for (let cluster in state) {
        if (state.hasOwnProperty(cluster)) {
            let points = state[cluster].points;
            let [avgX, avgY] = points
                .reduce(
                    ([sumX, sumY], item) => [sumX + item.x, sumY + item.y],
                    [0, 0]
                )
                .map((sum) => Math.floor(sum / points.length));
            coords[cluster] = { x: avgX, y: avgY };
        } else {
            throw new Error(`Object state doesn't contain property ${cluster}`);
        }
    }

    return coords;
}

function setClustersCoords(clusters, coords) {
    clusters.forEach((cluster, index) => {
        cluster.x = coords[index].x;
        cluster.y = coords[index].y;
    });
}

function indexCluster(arr) {
    try {
        let minDistance = Math.min.apply(null, arr);
        return arr.indexOf(minDistance);
    } catch {
        throw new Error(`Failed to calculate the cluster index`);
    }
}

function distanceBetween(fromX, fromY, toX, toY) {
    return Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
}

module.exports = clusteringData;
