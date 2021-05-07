import React, { useRef, useEffect } from "react";

let worker = null;
let initCanvasWidth;
let initCanvasHeight;

function randomRGBColor() {
    return Array(3)
        .fill()
        .map(() => Number(Math.random().toFixed(2)));
}

function convertToCanvasSize(canvas, x, y) {
    let rect = canvas.getBoundingClientRect();

    return [
        ((x - rect.x) * initCanvasWidth) / canvas.width,
        ((y - rect.y) * initCanvasHeight) / canvas.height,
    ];
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function handleWorkerMessage(e) {
    let type = e.data.type;

    switch (type) {
        case "timer":
            let finishTime = new Date() - window.startTime;
            console.log(`Время затраченное на кластеризацию ms: ${finishTime}`);
            break;
    }
}

function initWebGL(canvas) {
    let canvasSize = Canvas.getSize();

    [initCanvasWidth, initCanvasHeight] = canvasSize;

    worker.postMessage(
        {
            type: "init",
            canvas,
            size: canvasSize,
        },
        [canvas]
    );
}

function resizeCanvas() {
    worker.postMessage({
        type: "size",
        size: Canvas.getSize(),
    });
}

function setPoints(points, color, radius) {
    let canvasSize = Canvas.getSize();

    [initCanvasWidth, initCanvasHeight] = canvasSize;

    worker.postMessage({
        type: "points",
        pointsData: [
            {
                points,
                color,
                radius,
            },
        ],
        size: canvasSize,
    });
}

function setCenterGravity(index, center) {
    worker.postMessage({
        type: "center",
        index,
        center,
    });
}

function setClusteringData(states) {
    worker.postMessage({
        type: "clusters",
        states,
    });
}

export default function Canvas(props) {
    let canvas = useRef(null);
    let points = props.points;
    let pointColor = props.pointDefaultColor;
    let pointRadius = props.pointRadius;
    let clustersStates = props.clusteringData;
    let centersGravity = new Map();

    Canvas.getSize = () => {
        return [canvas.current.clientWidth, canvas.current.clientHeight];
    };

    Canvas.getCentersGravity = () => {
        return Array.from(centersGravity.values());
    };

    useEffect(() => {
        if (canvas.current.transferControlToOffscreen) {
            let offScreenCanvas = canvas.current.transferControlToOffscreen();

            worker = new Worker("/webgl/webgl.js");

            initWebGL(offScreenCanvas);

            worker.onmessage = handleWorkerMessage;
        } else {
            alert("Ваш браузер не поддерживает offScreenCanvas");
        }

        window.addEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        setPoints(points, pointColor, pointRadius);
    }, [points]);

    useEffect(() => {
        if (clustersStates.length) {
            setClusteringData(clustersStates);

            let lastState = clustersStates[clustersStates.length - 1];
            points = Object.values(lastState).reduce(
                (arr, cluster) => arr.concat(cluster.points),
                []
            );
        }
    }, [clustersStates]);

    const handleClick = (e) => {
        let [x, y] = convertToCanvasSize(canvas.current, e.clientX, e.clientY);

        for (let i = points.length - 1; i >= 0; i--) {
            if (distance(x, y, points[i].x, points[i].y) < pointRadius + 2) {
                if (!centersGravity.has(i)) {
                    let center = {
                        x: points[i].x,
                        y: points[i].y,
                        color: randomRGBColor(),
                        radius: pointRadius * 2,
                    };

                    centersGravity.set(i, center);

                    setCenterGravity(i, center);

                    return;
                }
            }
        }
    };

    return (
        <div className="content">
            <canvas id="canvas" ref={canvas} onClick={handleClick}>
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}
