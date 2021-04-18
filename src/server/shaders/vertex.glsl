attribute vec2 a_position;
attribute vec3 a_color;
attribute float a_radius;

varying vec3 v_color;

void main() {

    v_color = a_color;

    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = a_radius * 3.0;
}