importScripts("/webgl/resourses.js");

let canvas;
let gl;
let program;
let vertexArray;
let verticesNumber = 0;
let positionAttribLocation;
let colorAttribLocation;
let radiusAttribLocation;
let matrixProjection;
let matrixUniformLocation;

let handlers = {
    init: initWebGL,
    size: resizeCanvasToDisplaySize,
    points: setPoints,
    centers: setCentersGravity,
    clusters: setClustersStates,
};

onmessage = (e) => {
    let type = e.data.type;
    let fn = handlers[type];

    if (!fn) {
        throw new Error(`Not handler for type: "${type}"`);
    }

    fn(e.data);
};

async function initWebGL(data) {
    canvas = data.canvas;
    let size = data.size;

    gl =
        canvas.getContext("webgl", {
            premultipliedAlpha: false,
        }) || canvas.getContext("experimental-webgl");

    if (!gl) {
        throw new Error("Your browser does not support WebGL");
    }

    let shaders = await Promise.all([
        loadTextResource("/shaders/vertex.glsl"),
        loadTextResource("/shaders/fragment.glsl"),
    ]);

    if (shaders) {
        matrixProjection = getProjectionMatrix(...size);
        resizeCanvasToDisplaySize({ size });
        startWebGL(...shaders);
    }
}

function startWebGL(vertexShaderText, fragmentShaderText) {
    gl.getExtension("OES_standard_derivatives");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    program = createProgram(gl, vertexShaderText, fragmentShaderText);

    let arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    updateArrayBuffer();
}

function draw() {
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrixProjection);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.enableVertexAttribArray(radiusAttribLocation);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.drawArrays(gl.POINTS, 0, verticesNumber);
}

function resizeCanvasToDisplaySize(data) {
    let [width, height] = data.size;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    draw();
}

function updateArrayBuffer() {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexArray),
        gl.STATIC_DRAW
    );

    positionAttribLocation = gl.getAttribLocation(program, "a_position");

    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    colorAttribLocation = gl.getAttribLocation(program, "a_color");

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    radiusAttribLocation = gl.getAttribLocation(program, "a_radius");

    gl.vertexAttribPointer(
        radiusAttribLocation,
        1,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        5 * Float32Array.BYTES_PER_ELEMENT
    );

    matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

    verticesNumber = vertexArray.length / 6;

    draw();
}

function setPoints(data) {
    let { pointsData, size } = data;
    let transformedArray = [];

    if (size) matrixProjection = getProjectionMatrix(...size);

    for (let { points, color, radius } of pointsData) {
        if (points.length) {
            for (let point of points) {
                transformedArray = transformedArray.concat(
                    point.x,
                    point.y,
                    color,
                    radius
                );
            }
        }
    }

    vertexArray = transformedArray;

    if (gl && program) {
        if (pointsData.length > 1) {
            self.postMessage({
                type: "timer",
            });
        }
        updateArrayBuffer();
    }
}

function setCentersGravity(data) {
    let { centers } = data;

    for (let idCenter in centers) {
        let color = centers[idCenter].color;
        let radius = centers[idCenter].radius;
        let data = color.concat(radius);

        vertexArray.splice(idCenter * 6 + 2, 4, ...data);
    }

    if (gl && program) {
        updateArrayBuffer();
    }
}

function setClustersStates(data) {
    let { states } = data;
    let idState = 0;

    if (states.length) {
        let animClustering = () => {
            let state = Object.values(states[idState]);
            pointsData = [];

            for (let cluster of state) {
                pointsData.push({
                    points: [{ x: cluster.x, y: cluster.y }],
                    color: cluster.color,
                    radius: 10,
                });
                pointsData.push({
                    points: cluster.points,
                    color: cluster.color,
                    radius: 5,
                });
            }

            setPoints({ pointsData });

            idState++;

            let idAnimation = requestAnimationFrame(animClustering);

            if (idState >= states.length) cancelAnimationFrame(idAnimation);
        };

        requestAnimationFrame(animClustering);
    }
}
