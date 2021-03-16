import React, { useState } from "react";
import Menu from "./Menu/Menu";
import Canvas from "./Canvas/Canvas";
import "./App.css";

async function apiRequest(path, data = {}) {
    const response = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        return await response.json();
    } else {
        alert("Проблемы с сервером");
        throw new Error(`Error request to ${path}`);
    }
}

function App() {
    const [points, setPoints] = useState([]);

    const fetchPoints = (numberPoints) => {
        const data = {
            numberPoints: numberPoints,
            canvasWidth: Canvas.width(),
            canvasHeight: Canvas.height(),
            pointSize: 5,
        };

        apiRequest("/api/generate_points", data).then((points) => {
            setPoints(points);
        });
    };

    return (
        <div className="wrapper">
            <Menu generate={fetchPoints} />
            <Canvas points={points} />
        </div>
    );
}

export default App;
