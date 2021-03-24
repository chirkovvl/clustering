import React, { useRef, useEffect } from "react";

const END_ANGLE = Math.PI * 2;
const pointSize = 5;
const pointColor = "#C34A36";

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
        if (points.length) {
            ctx.fillStyle = pointColor;
            ctx.beginPath();

            for (let point of points) {
                let x = (point.x * canvas.clientWidth) / width;
                let y = (point.y * canvas.clientHeight) / height;
                let radius = pointSize;

                if (point.selected) {
                    radius *= 2;
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = point.color;
                    ctx.beginPath();
                }

                ctx.moveTo(x, y);
                ctx.arc(x, y, radius, 0, END_ANGLE, true);

                if (point.selected) {
                    ctx.fill();
                    ctx.fillStyle = pointColor;
                    ctx.beginPath();
                }

                point.x = x;
                point.y = y;
            }

            width = canvas.clientWidth;
            height = canvas.clientHeight;

            ctx.fill();
        }

        requestAnimFrame(drawloop);
    }

    drawloop();
}

function convertToCanvasSize(canvas, currentX, currentY) {
    let x = currentX - (window.innerWidth - canvas.clientWidth);
    let y = currentY - (window.innerHeight - canvas.clientHeight);

    return [x, y];
}

function getDistanceBetween(fromX, fromY, toX, toY) {
    return Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
}

function getRandomHexColor() {
    let max = 16777215;
    let min = 0;

    let decNumber = Math.floor(min - 0.5 + Math.random() * (max - min + 1));
    return "#" + decNumber.toString(16);
}

function chooseCenterGravity(points, x, y) {
    for (let i = points.length - 1; i >= 0; i--) {
        let distance = getDistanceBetween(x, y, points[i].x, points[i].y);

        if (distance < pointSize + 2) {
            if (!points[i].selected) {
                points[i].selected = true;
                points[i].color = getRandomHexColor();
                return points[i];
            }
        }
    }
}

function Canvas(props) {
    const canvas = useRef(null);
    let points = props.points;
    let centersGravity = [];

    Canvas.getWidth = () => canvas.current.width;
    Canvas.getHeight = () => canvas.current.height;
    Canvas.getPointSize = () => pointSize;

    const clickHandler = (e) => {
        let [x, y] = convertToCanvasSize(e.target, e.clientX, e.clientY);
        let centerGravity = chooseCenterGravity(points, x, y);

        if (centerGravity) centersGravity.push(centerGravity);
    };

    useEffect(() => {
        canvas.current.addEventListener("click", clickHandler);
        return () => canvas.current.removeEventListener("click", clickHandler);
    });

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
