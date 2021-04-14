import React, { useRef, useEffect } from "react";
import WebGL from "./webgl/webgl";

let webgl = null;

function Canvas(props) {
    let canvas = useRef(null);
    let points = props.points;

    useEffect(() => {
        webgl = new WebGL(canvas.current);
    }, []);

    useEffect(() => {
        console.log(JSON.stringify(points));
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
