attribute vec2 a_position;
attribute vec3 a_color;
attribute float a_radius;

varying vec3 v_color;

uniform mat3 u_matrix;

void main() {

    v_color = a_color;
  
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    gl_PointSize = a_radius * 3.0;
}