import { ShaderMaterial } from 'three'

export default function createMaterial() {
  return new ShaderMaterial({
    vertexShader: `
      uniform lowp sampler2DArray uDataset;
      uniform vec2 uElevation;

      attribute vec4 aLayer;
      attribute mat2 aOrientation;
      attribute vec3 aFlag;

      varying vec4 vTileLayer;
      varying vec4 vVertexColor;
      varying vec3 vTileFlag;

      void main() {
        vec2 coord = (aLayer.zw + uv) / 0.5;
        vec4 data0 = texelFetch(uDataset, ivec3(coord, 0), 0);
        vec4 data1 = texelFetch(uDataset, ivec3(coord, 1), 0);

        vTileLayer.xy = (uv - 0.5) * aOrientation + 0.5;
        vTileLayer.zw = aLayer.xy;

        vVertexColor = data0;
        vTileFlag = aFlag;

        vec3 pos = vec3(aLayer.z, 0, aLayer.w) + position;
        pos.y += data1.r * (uElevation.x - uElevation.y) + uElevation.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform lowp sampler2DArray uTexture;

      varying vec4 vTileLayer;
      varying vec4 vVertexColor;
      varying vec3 vTileFlag;

      void main() {
        vec4 top = texture(uTexture, vTileLayer.xyz);
        vec4 bottom = texture(uTexture, vTileLayer.xyw);

        vec4 logic = vec4(1.0, 0.0, 0.0, 0.0);
        vec4 type = vec4(0.0, 1.0, 0.0, 0.0);
        vec4 tile = vec4(0.0, 0.0, 1.0, 0.0);

        vec4 color = mix(bottom, top, vVertexColor.a) * vVertexColor;
        color = mix(color, type.bgra, vTileFlag.x * 0.6);
        color = mix(color, logic.bgra, vTileFlag.y * 0.6);
        color = mix(color, tile.bgra, vTileFlag.z * 0.6);

        gl_FragColor = vec4(color.bgr, 1.0);
      }
    `
  })
}
