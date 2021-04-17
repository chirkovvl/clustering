import {
    loadTextResource,
    createProgram,
    converToSpaceClip,
    initRequestAnimFrame,
} from "./resourses";

class WebGL {
    constructor(canvas) {
        this.canvas = canvas;
        this._draw = this._draw.bind(this);
        this._vertexArray = [];
        this.pointSize = 5;
        this._init();
    }

    _init() {
        initRequestAnimFrame();

        Promise.all([
            loadTextResource("/vertex.glsl"),
            loadTextResource("/fragment.glsl"),
        ])
            .then((shaders) => {
                return this._start(...shaders);
            })
            .catch((error) => {
                alert(`Error with loading resourses. See console`);
                console.error(error);
            });
    }

    _start(vertexShaderText, fragmentShaderText) {
        const gl =
            this.canvas.getContext("webgl", {
                premultipliedAlpha: false,
            }) || this.canvas.getContext("experimental-webgl");

        if (!gl) {
            alert(`Your browser does not support WebGL`);
            return;
        }

        gl.getExtension("OES_standard_derivatives");
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const program = createProgram(gl, vertexShaderText, fragmentShaderText);

        let arrayBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
        this._updateArrayBuffer(gl, program);

        this.pointSizeUniformLocation = gl.getUniformLocation(
            program,
            "u_pointSize"
        );

        this.gl = gl;
        this.program = program;

        requestAnimFrame(this._draw);
    }

    _draw() {
        this._resizeCanvasToDisplaySize(this.canvas);
        this.gl.viewport(
            0,
            0,
            this.canvas.clientWidth,
            this.canvas.clientHeight
        );

        this.gl.uniform1f(this.pointSizeUniformLocation, this.pointSize);
        this.gl.enableVertexAttribArray(this.positionAttribLocation);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.gl.drawArrays(this.gl.POINTS, 0, this._verticesNumber);

        requestAnimFrame(this._draw);
    }

    _resizeCanvasToDisplaySize(canvas) {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }

    _updateArrayBuffer(gl, program) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this._vertexArray),
            gl.STATIC_DRAW
        );

        let positionAttribLocation = gl.getAttribLocation(
            program,
            "a_position"
        );

        gl.vertexAttribPointer(
            positionAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT
        );

        this._verticesNumber = this._vertexArray.length / 2;
        this.positionAttribLocation = positionAttribLocation;
    }

    /**
     * @param {string | any[]} coords
     */
    set points(coords) {
        let transformedArray = [];

        if (coords.length) {
            for (let coord of coords) {
                transformedArray = transformedArray.concat(
                    converToSpaceClip(this.canvas, coord.x, coord.y)
                );
            }
        }

        this._vertexArray = transformedArray;
        if (this.gl && this.program) {
            this._updateArrayBuffer(this.gl, this.program);
        }
    }
}

export default WebGL;
