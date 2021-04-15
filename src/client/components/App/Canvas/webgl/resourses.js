export async function loadTextResource(path) {
    let response = await fetch(path);

    if (response.ok) return await response.text();
    else throw new Error(`Fetched response within status: ${response.status}`);
}

export function createProgram(gl, vertexShaderText, fragmentShaderText) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);

    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderText
    );

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        throw new Error(`Program error info: ${gl.getProgramInfoLog(program)}`);
    }

    return program;
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Shader error info: ${gl.getShaderInfoLog(shader)}`);
    }

    return shader;
}

export function converToSpaceClip(canvas, x, y) {
    let middleX = canvas.clientWidth / 2;
    let middleY = canvas.clientHeight / 2;

    x = (x - middleX) / middleX;
    y = (middleY - y) / middleY;

    return [x, y];
}
