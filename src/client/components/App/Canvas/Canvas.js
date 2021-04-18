import React, { useRef, useEffect } from "react";
import WebGL from "./webgl/webgl";

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
    }, [points]);

    return (
        <div className="content">
            <canvas id="canvas" ref={canvas}>
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
