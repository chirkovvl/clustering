#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

varying vec3 v_color;

void main() {
    
    vec2 center = vec2(0.5);
    float dist = distance(gl_PointCoord, center);
    float delta = fwidth(dist);
    float alpha = smoothstep(0.40 - delta, 0.40 + delta, dist);
    vec4 color = vec4(v_color, 1.0);
    gl_FragColor = mix(color, gl_FragColor, alpha);
}

   