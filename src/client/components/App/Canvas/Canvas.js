import React, { useRef, useEffect } from "react";

function draw(canvas, scaleX, scaleY) {
    const ctx = canvas.getContext("2d");

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    ctx.scale(scaleX, scaleY);

    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.fillStyle = "#f3223f";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 15, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function Canvas() {
    const canvas = useRef(null);

    const resized = () => {
        canvas.current.width = canvas.current.clientWidth;
        canvas.current.height = canvas.current.clientHeight;
    };

    useEffect(() => {
        resized();
        draw(canvas.current);
    });

    // useEffect(() => {
    //     canvas.current.onresize = resized;
    //     console.log(canvas);
    //     return () => canvas.current.removeEventListener("resize", resized);
    // }, []);

    return (
        <div className="content">
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }}>
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
