import React, { useRef, useEffect } from "react";

const END_ANGLE = Math.PI * 2;

function draw(canvas, points) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    function drawloop(time) {
        if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        ctx.clearRect(0, 0, width, height);

        // Рисуем точки
        ctx.fillStyle = "#f3223f";
        ctx.beginPath();
        for (let point of points) {
            drawPoint(
                ctx,
                (point.x * width) / canvas.clientWidth,
                (point.y * height) / canvas.clientHeight
            );
        }
        ctx.fill();

        requestAnimationFrame(drawloop);
    }

    drawloop();
}

function drawPoint(ctx, x, y) {
    ctx.moveTo(x, y);
    ctx.arc(x, y, 5, 0, END_ANGLE, true);
}

function Canvas(props) {
    const canvas = useRef(null);

    let points = props.points;

    useEffect(() => {
        draw(canvas.current, points);
    }, [points]);

    Canvas.width = () => canvas.current.width;
    Canvas.height = () => canvas.current.height;

    return (
        <div className="content">
            <canvas
                ref={canvas}
                style={{ width: "100%", height: "100%", background: "#ddd" }}
            >
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
