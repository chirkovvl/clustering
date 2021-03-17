import React, { useRef, useEffect } from "react";

const END_ANGLE = Math.PI * 2;
const pointSize = 5;

window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

function draw(canvas, points) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    function drawloop(time) {
        if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        // Очищаем и заполняем канву
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#B0A8B9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Рисуем точки
        ctx.fillStyle = "#C34A36";
        ctx.beginPath();
        for (let point of points) {
            drawPoint(
                ctx,
                (point.x * canvas.clientWidth) / width,
                (point.y * canvas.clientHeight) / height
            );
        }
        ctx.fill();

        requestAnimFrame(drawloop);
    }

    drawloop();
}

function drawPoint(ctx, x, y) {
    ctx.moveTo(x, y);
    ctx.arc(x, y, pointSize, 0, END_ANGLE, true);
}

function Canvas(props) {
    const canvas = useRef(null);
    let points = props.points;

    Canvas.getWidth = () => canvas.current.width;
    Canvas.getHeight = () => canvas.current.height;
    Canvas.getPointSize = () => pointSize;

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
