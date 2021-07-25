import {
  BufferGeometry,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  Uint16BufferAttribute
} from './three/build/three.module.js'

export default function(vertices, indices) {
  const size = 6
  const buffer = new ArrayBuffer(vertices.numVertices * size * 4)
  const floats = new Float32Array(buffer)
  const bytes = new Uint8Array(buffer)

  for (let i = 0; i < vertices.numVertices; i++) {
    let offset = i * size

    floats[offset++] = vertices.points[i * 3]
    floats[offset++] = vertices.points[i * 3 + 1]
    floats[offset++] = vertices.points[i * 3 + 2]

    offset = i * size * 4 + 12

    bytes[offset++] = vertices.colors[i * 4]
    bytes[offset++] = vertices.colors[i * 4 + 1]
    bytes[offset++] = vertices.colors[i * 4 + 2]
    bytes[offset++] = vertices.colors[i * 4 + 3]

    offset = i * size + 4

    floats[offset++] = vertices.uv[i * 2]
    floats[offset++] = vertices.uv[i * 2 + 1]
  }

  const floatBuffer = new InterleavedBuffer(floats, size)
  const byteBuffer = new InterleavedBuffer(bytes, size * 4)

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new InterleavedBufferAttribute(floatBuffer, 3, 0))
  geometry.setAttribute('color', new InterleavedBufferAttribute(byteBuffer, 4, 12, true))
  geometry.setAttribute('uv', new InterleavedBufferAttribute(floatBuffer, 2, 4))
  geometry.setIndex(new Uint16BufferAttribute(indices, 1))

  return geometry
}
