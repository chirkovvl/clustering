import React, { useRef, useEffect } from "react";

function draw(canvas) {
    const ctx = canvas.getContext("2d");

    function mainloop(time) {
        let width = canvas.width;
        let height = canvas.height;

        if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        ctx.fillStyle = "#ddd";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#f3223f";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 15, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        requestAnimationFrame(mainloop);
    }

    requestAnimationFrame(mainloop);
}

function Canvas() {
    const canvas = useRef(null);

    useEffect(() => {
        draw(canvas.current);
    }, []);

    return (
        <div className="content">
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }}>
                <p>Ваш баузер не поддерживает canvas</p>
            </canvas>
        </div>
    );
}

export default Canvas;
