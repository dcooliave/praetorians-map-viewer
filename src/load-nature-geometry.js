import {
  BufferGeometry,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  Uint16BufferAttribute
} from './three/build/three.module.js'

export default function(vertices, indices) {
  const size = 9
  const data = []

  for (let i = 0; i < vertices.numVertices; i++) {
    data.push(
      vertices.points[i * 3],
      vertices.points[i * 3 + 1],
      vertices.points[i * 3 + 2],

      vertices.colors[i * 4] / 255,
      vertices.colors[i * 4 + 1] / 255,
      vertices.colors[i * 4 + 2] / 255,
      vertices.colors[i * 4 + 3] / 255,

      vertices.uv[i * 2],
      vertices.uv[i * 2 + 1]
    )
  }

  const buffer = new InterleavedBuffer(new Float32Array(data), size)

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new InterleavedBufferAttribute(buffer, 3, 0))
  geometry.setAttribute('color', new InterleavedBufferAttribute(buffer, 4, 3))
  geometry.setAttribute('uv', new InterleavedBufferAttribute(buffer, 2, 7))
  geometry.setIndex(new Uint16BufferAttribute(indices, 1))

  return geometry
}
