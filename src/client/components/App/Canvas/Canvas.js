import React, { useRef, useEffect } from "react";

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

export default function Canvas(props) {
    let canvas = useRef(null);
    let points = props.points;
    let pointsColor = props.pointDefaultColor;
    let pointsRadius = props.pointsRadius;

    useEffect(() => {
        // Canvas.getSize = () => [
        //     webgl.canvas.clientWidth,
        //     webgl.canvas.clientHeight,
        // ];
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
                    webgl.points = points;
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
