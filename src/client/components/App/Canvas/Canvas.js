import React, { useRef, useEffect } from "react";

const END_ANGLE = Math.PI * 2;
const pointSize = 5;
let defaultPointColor = "#C34A36";

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

function draw(canvas, points, centersGravity, clusteredData) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    let states = clusteredData || [];
    let pointColor = defaultPointColor;

    const convertCoords = (pointX, pointY) => {
        let x = Math.round((pointX * canvas.clientWidth) / width);
        let y = Math.round((pointY * canvas.clientHeight) / height);

        return [x, y];
    };

    const drawPoints = () => {
        ctx.fillStyle = pointColor;
        ctx.beginPath();

        for (let point of points) {
            let [x, y] = convertCoords(point.x, point.y);

            ctx.moveTo(x, y);
            ctx.arc(x, y, pointSize, 0, END_ANGLE, true);

            point.x = x;
            point.y = y;
        }

        ctx.fill();
    };

    const drawCentersGravity = () => {
        for (let center of centersGravity) {
            let [x, y] = convertCoords(center.x, center.y);

            ctx.fillStyle = center.color;
            ctx.beginPath();
            ctx.arc(x, y, pointSize * 2, 0, END_ANGLE, true);
            ctx.fill();

            center.x = x;
            center.y = y;
        }
    };

    const drawClusteringData = () => {
        let state = states[0];

        for (let cluster in state) {
            if (state.hasOwnProperty(cluster)) {
                points = state[cluster].points;
                pointColor = state[cluster].color;
                drawPoints();

                centersGravity[cluster] = {
                    x: state[cluster].x,
                    y: state[cluster].y,
                    color: pointColor,
                };
            }
        }

        drawCentersGravity();
    };

    const drawloop = (time) => {
        if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!states.length) {
            drawPoints();
            drawCentersGravity();
        } else {
            drawClusteringData();
        }

        width = canvas.clientWidth;
        height = canvas.clientHeight;

        requestAnimFrame(drawloop);
    };

    drawloop();
}

function convertToCanvasSize(canvas, currentX, currentY) {
    let x = currentX - (window.innerWidth - canvas.clientWidth);
    let y = currentY - (window.innerHeight - canvas.clientHeight);

    return [x, y];
}

function distanceBetween(fromX, fromY, toX, toY) {
    return Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
}

function randomHexColor() {
    const max = 16777215;
    const min = 0;

    let decNumber = Math.floor(min - 0.5 + Math.random() * (max - min + 1));
    return "#" + decNumber.toString(16);
}

function chooseCenterGravity(points, x, y) {
    for (let i = points.length - 1; i >= 0; i--) {
        let distance = distanceBetween(x, y, points[i].x, points[i].y);

        if (distance < pointSize + 2) {
            if (!points[i].selected) {
                points[i].selected = true;
                return {
                    x: points[i].x,
                    y: points[i].y,
                    color: randomHexColor(),
                };
            }
        }
    }
}

function Canvas(props) {
    const canvas = useRef(null);

    let points = props.points;
    let clusteredData = props.clusteredData;
    let centersGravity = [];

    Canvas.getWidth = () => canvas.current.width;
    Canvas.getHeight = () => canvas.current.height;
    Canvas.getPointSize = () => pointSize;
    Canvas.getCentersGravity = () => centersGravity;

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
        points = [];
        draw(canvas.current, points, centersGravity, clusteredData);
    }, [clusteredData]);

    useEffect(() => {
        draw(canvas.current, points, centersGravity);
    }, [points]);

    return (
        <div className="content">
            <canvas
                id="canvas"
                ref={canvas}
                style={{ width: "100%", height: "100%" }}
            >
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
