import React, { useRef, useEffect } from "react";

function draw(canvas, points) {
    const ctx = canvas.getContext("2d");

    function drawloop(time) {
        let width = canvas.width;
        let height = canvas.height;

        if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ddd";
        ctx.fillRect(0, 0, width, height);

        points.forEach((point) => {
            drawPoint(ctx, point.x, point.y);
        });

        requestAnimationFrame(drawloop);
    }

    drawloop();
}

function drawPoint(ctx, x, y) {
    ctx.fillStyle = "#f3223f";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function Canvas(props) {
    const canvas = useRef(null);

    let points = props.points;

    useEffect(() => {
        draw(canvas.current, points);
    }, [points]);

    return (
        <div className="content">
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }}>
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
