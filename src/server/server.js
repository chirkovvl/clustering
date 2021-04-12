const express = require("express");
const path = require("path");
const generatePoints = require("./lib/generate");
const clusteringPoint = require("./lib/clustering");
const { host, port } = require("./config/config");

const app = express();

app.use(express.static(path.resolve(__dirname, "shaders")));
app.use(express.json());

app.post("/api/generate", (req, res) => {
    const { width, height, radius, quantity } = req.body;
    let result = generatePoints(width, height, radius, quantity);
    res.json(result);
});

app.post("/api/clustering", (req, res) => {
    res.json({ message: "Еще не реализовано" });
});

app.listen(port, () => console.info(`Server started on ${host}:${port}`));
