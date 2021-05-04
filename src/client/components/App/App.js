import React from "react";
import Menu from "./Menu/Menu";
import Canvas from "./Canvas/Canvas";
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            points: [],
            pointRadius: 5,
            pointDefaultColor: [0.5, 0.5, 0.5],
            clustersStates: [],
            maxNumberPoints: 10000,
        };

        this._fetchPoints = this._fetchPoints.bind(this);
        this._fetchClusteringData = this._fetchClusteringData.bind(this);
    }

    _fetchPoints(quantity) {
        let [canvasWidth, canvasHeight] = Canvas.getSize();

        const data = {
            width: canvasWidth,
            height: canvasHeight,
            radius: this.state.pointRadius,
            quantity: quantity,
        };

        this._apiRequest("/api/generate", data).then((points) => {
            this.setState({ points: points });
        });
    }

    _fetchClusteringData() {
        window.startTime = new Date();
        let centersGravity = Canvas.getCentersGravity();

        if (!centersGravity.length) {
            alert("Отсутствуют центры гравитации");
            return;
        }

        const data = {
            points: this.state.points,
            centersGravity,
        };

        this._apiRequest("/api/clustering", data).then((clustersStates) => {
            this.setState({ clustersStates });
        });
    }

    async _apiRequest(path, data = {}) {
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
            throw new Error(await response.text());
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Menu
                    generate={this._fetchPoints}
                    clustering={this._fetchClusteringData}
                    maxNumberPoints={this.state.maxNumberPoints}
                />
                <Canvas
                    clusteringData={this.state.clustersStates}
                    points={this.state.points}
                    pointRadius={this.state.pointRadius}
                    pointDefaultColor={this.state.pointDefaultColor}
                />
            </div>
        );
    }
}

export default App;
