import { ShaderMaterial } from 'three'

export default function() {
  return new ShaderMaterial({
    vertexShader: `
      attribute vec4 color;

      varying vec4 vcolor;
      varying vec2 vuv;

      void main() {
        vuv = uv;
        vcolor = color;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uDirection;
      uniform float uTime;

      varying vec4 vcolor;
      varying vec2 vuv;

      void main() {
        float speed = 1.;
        float offset = .2;
        float distortion = .05;
        float time = uTime / 1000.;

        vec2 travel = vec2(.0, .02) * time;
        vec2 uv = vuv + (speed * uDirection * time);
        uv += texture2D(uTexture, uv + travel).bg * distortion;
        uv += texture2D(uTexture, uv + offset - travel).bg * distortion;

        vec4 color = texture2D(uTexture, uv) * vcolor;

        gl_FragColor = color.bgra;
      }
    `
  })
}
