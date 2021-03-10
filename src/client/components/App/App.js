import React from "react";
import Menu from "./Menu/Menu";
import Canvas from "./Canvas/Canvas";
import "./App.css";

function App() {
    return (
        <div className="wrapper">
            <Menu />
            <Canvas />
        </div>
    );
}

export default App;
