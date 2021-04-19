import React, { useRef, useEffect } from "react";
import WebGL from "./webgl/webgl";
import {
    convertToCanvasSize,
    distance,
    randomRGBColor,
} from "./webgl/resourses";

let webgl = new WebGL();

function Canvas(props) {
    let canvas = useRef(null);
    let points = props.points;

    useEffect(() => {
        webgl.init(canvas.current);

        Canvas.getSize = () => [
            webgl.canvas.clientWidth,
            webgl.canvas.clientHeight,
        ];
    }, []);

    useEffect(() => {
        if (points.length) {
            points = points.map((point) => {
                point.color = props.pointDefaultColor;
                point.radius = props.pointRadius;
                return point;
            });
        }

        webgl.points = points;
        console.log(points);
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

export default Canvas;
