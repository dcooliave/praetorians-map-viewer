import { ShaderMaterial } from './three.module.js'

export default function() {
  return new ShaderMaterial({
    vertexShader: `
      uniform float uTime;

      attribute vec2 aWind;
      attribute vec4 color;

      varying vec4 vcolor;
      varying vec2 vuv;

      void main() {
        vuv = uv;
        vcolor = color;

        float angle = cos(uTime / 500. + aWind.x) * .01 * aWind.y;
        mat2 sway = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

        vec3 pos = position.xyz;
        pos.yz *= sway;

        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;

      varying vec4 vcolor;
      varying vec2 vuv;

      void main() {
        vec4 color = texture2D(uTexture, vuv) * vcolor;

        #ifdef ALPHATEST
        if (color.a < ALPHATEST) discard;
        #endif

        gl_FragColor = color.bgra;
      }
    `
  })
}
