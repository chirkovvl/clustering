attribute vec2 a_position;
uniform float u_pointSize;

void main() {

    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = u_pointSize * 3.0;
}