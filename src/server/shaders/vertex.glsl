attribute vec3 a_Position;

uniform float u_radius;

void main() {
    
    gl_Position = a_Position;
    gl_PointSize = u_radius;
}