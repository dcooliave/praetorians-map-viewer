import { ShaderMaterial } from './three/build/three.module.js'

export default function createMaterial() {
  return new ShaderMaterial({
    vertexShader: `
      uniform lowp sampler2DArray uDataset;
      uniform vec2 uElevation;

      attribute vec4 aCoordinate;
      attribute vec3 aOrientation;
      attribute vec3 aFlag;

      varying vec3 vTopUV;
      varying vec3 vBottomUV;
      varying vec4 vVertexColor;
      varying vec3 vTileFlag;

      void main() {
        vec2 layer = aCoordinate.xy;
        vec2 coord = (aCoordinate.zw + uv) / 0.5;

        vec4 data0 = texelFetch(uDataset, ivec3(coord, 0), 0);
        vec4 data1 = texelFetch(uDataset, ivec3(coord, 1), 0);

        float angle = aOrientation.x;
        float sizex = aOrientation.y;
        float sizey = aOrientation.z;

        mat2 scale = mat2(sizex, 0.0, 0.0, sizey);
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

        vec2 uvtile = (uv - 0.5) * rotation * scale + 0.5;
        vTopUV = vec3(uvtile, layer.x);
        vBottomUV = vec3(uvtile, layer.y);

        vVertexColor = data0;
        vTileFlag = aFlag;

        vec4 vert = vec4(position, 1.0);
        vert.y += data1.r * (uElevation.x - uElevation.y) + uElevation.y;

        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vert;
      }
    `,
    fragmentShader: `
      uniform lowp sampler2DArray uTexture;

      varying vec3 vTopUV;
      varying vec3 vBottomUV;
      varying vec4 vVertexColor;
      varying vec3 vTileFlag;

      void main() {
        vec4 top = texture(uTexture, vTopUV);
        vec4 bottom = texture(uTexture, vBottomUV);

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
