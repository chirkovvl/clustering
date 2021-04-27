import React, { useRef, useEffect } from "react";

let worker = null;

function randomRGBColor() {
    return [randomNumber(1, 255), randomNumber(1, 255), randomNumber(1, 255)];
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1));
}

function convertToCanvasSize(canvas, x, y) {
    let rect = canvas.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function handleWorkerMessage(e) {
    let type = e.data.type;

    switch (type) {
        case "inited":
            resizeCanvas();
            break;
    }
}

function resizeCanvas() {
    let [width, height] = Canvas.getSize();

    worker.postMessage({
        type: "size",
        width,
        height,
    });
}

export default function Canvas(props) {
    let canvas = useRef(null);
    let points = props.points;
    let pointsColor = props.pointDefaultColor;
    let pointsRadius = props.pointsRadius;

    useEffect(() => {
        Canvas.getSize = () => {
            return [canvas.current.clientWidth, canvas.current.clientHeight];
        };

        if (canvas.current.transferControlToOffscreen) {
            let offScreenCanvas = canvas.current.transferControlToOffscreen();

            worker = new Worker("/webgl/webgl.js");

            worker.postMessage(
                {
                    type: "main",
                    canvas: offScreenCanvas,
                },
                [offScreenCanvas]
            );

            worker.onmessage = handleWorkerMessage;
        } else {
            alert("Ваш браузер не поддерживает offScreenCanvas");
        }

        window.addEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        if (points.length) {
            points = points.map((point) => {
                point.color = pointsColor;
                point.radius = pointsRadius;
                return point;
            });
        }

        console.log("Подготовленные точки:", points);
    }, [points]);

    const handleClick = (e) => {
        let [x, y] = convertToCanvasSize(canvas.current, e.clientX, e.clientY);

        for (let i = points.length - 1; i >= 0; i--) {
            if (distance(x, y, points[i].x, points[i].y) < props.pointRadius) {
                if (!points[i].selected) {
                    points[i].color = randomRGBColor();
                    points[i].radius *= 2;
                    points[i].selected = true;
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
