import React from "react"
import Menu from "./Menu/Menu"
import Canvas from "./Canvas/Canvas"
import "./App.css"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            points: [],
            pointRadius: 5,
            pointDefaultColor: [0.5, 0.5, 0.5],
            clustersStates: [],
            maxNumberPoints: 10000,
            centersGravity: new Map(),
        }

        this._fetchPoints = this._fetchPoints.bind(this)
        this._fetchClusteringData = this._fetchClusteringData.bind(this)
    }

    _fetchPoints(quantity) {
        let [canvasWidth, canvasHeight] = Canvas.getSize()

        const body = {
            width: canvasWidth,
            height: canvasHeight,
            radius: this.state.pointRadius,
            quantity: quantity,
        }

        this._apiRequest("/api/generate", "GET", body).then((points) => {
            this.state.centersGravity.clear()

            this.setState({
                points: points,
            })
        })
    }

    _fetchClusteringData() {
        window.startTime = new Date()

        let centersGravity = Array.from(this.state.centersGravity.values())

        if (!centersGravity.length) {
            alert("Отсутствуют центры гравитации")
            return
        }

        const body = {
            points: this.state.points,
            centersGravity,
        }

        this._apiRequest("/api/clustering", "POST", body).then(
            (clustersStates) => {
                this.setState({ clustersStates })
            }
        )
    }

    async _apiRequest(path, method = "GET", body = null, headers = {}) {
        const isCorrectPath = (path) => {
            // matched with template. The best solution is make it thought new RegExp()
            return true
        }

        const getQueryString = (obj) => {
            let queryString = ""

            for (let key in obj) {
                queryString += `${key}=${
                    obj.hasOwnProperty(key) ? obj[key] : null
                }&`
            }

            return `?${queryString.slice(0, queryString.length - 1)}`
        }

        if (!isCorrectPath(path)) {
            throw new Error(`Uncorrect path to resource: ${path}`)
        }

        switch (method) {
            case "GET":
                path = `${path}${getQueryString(body)}`
                body = null
                break
            case "POST":
                body = JSON.stringify(body)
                headers["Content-Type"] = "application/json"
                break
        }

        const response = await fetch(path, { method, headers, body })

        if (!response) {
            throw new Error(await response.text())
        }

        return await response.json()
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
                    centersGravity={this.state.centersGravity}
                />
            </div>
        )
    }
}

export default App
