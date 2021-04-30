const express = require("express");
const generatePoints = require("./lib/generate");
const clusteringPoint = require("./lib/clustering");
const { host, port } = require("./config/config");

const app = express();

app.use(express.json());

app.post("/generate", (req, res) => {
    const { width, height, radius, quantity } = req.body;
    let result = generatePoints(width, height, radius, quantity);
    res.json(result);
});

app.post("/clustering", (req, res) => {
    let { points, centersGravity } = req.body;
    let result = clusteringPoint(points, centersGravity);
    res.json(result);
});

app.listen(port, () => console.info(`Server started on ${host}:${port}`));
