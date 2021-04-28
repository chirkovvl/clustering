importScripts("/webgl/resourses.js");

let canvas;
let gl;
let program;
let vertexArray = [];
let verticesNumber = 0;
let positionAttribLocation;
let colorAttribLocation;
let radiusAttribLocation;

let handlers = {
    main: initWebGL,
    size: resizeCanvasToDisplaySize,
    points: setPoints,
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
        postMessage({
            type: "inited",
        });

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
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.enableVertexAttribArray(radiusAttribLocation);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.drawArrays(gl.POINTS, 0, verticesNumber);
}

function resizeCanvasToDisplaySize(data) {
    let { width, height } = data;

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

    verticesNumber = vertexArray.length / 6;

    draw();
}

function setPoints(data) {
    let { points } = data;

    let transformedArray = [];

    if (points.length) {
        for (let point of points) {
            transformedArray = transformedArray.concat(
                coordsToSpaceClip(canvas, point.x, point.y),
                colorToSpaceClip(point.color),
                point.radius
            );
        }
    }

    vertexArray = transformedArray;

    if (gl && program) {
        updateArrayBuffer();
    }
}
