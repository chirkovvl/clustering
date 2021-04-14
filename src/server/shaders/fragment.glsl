#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

void main() {
    
    vec2 center = vec2(0.5);
    float dist = distance(gl_PointCoord, center);
    float delta = fwidth(dist);
    float alpha = smoothstep(0.48 - delta, 0.48 + delta, dist);
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = mix(color, gl_FragColor, alpha);
}

   