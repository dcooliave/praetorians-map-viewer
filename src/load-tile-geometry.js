import {
  InterleavedBuffer,
  InstancedBufferGeometry,
  InterleavedBufferAttribute
} from './three/build/three.module.js'

export default function() {
  const size = 5
  const buffer = new ArrayBuffer(9 * size * 4)
  const floats = new Float32Array(buffer)

  for (let i = 0; i < 9; i++) {
    let offset = i * 5

    const y = Math.floor(i / 3)
    const x = i % 3

    floats[offset++] = x * .5
    floats[offset++] = 0
    floats[offset++] = y * .5
    floats[offset++] = x * .5
    floats[offset++] = y * .5
  }

  const floatBuffer = new InterleavedBuffer(floats, size)

  const geometry = new InstancedBufferGeometry()
  geometry.setAttribute('position', new InterleavedBufferAttribute(floatBuffer, 3, 0))
  geometry.setAttribute('uv', new InterleavedBufferAttribute(floatBuffer, 2, 3))
  geometry.setIndex([
    4, 5, 1, 4, 1, 3,
    4, 3, 7, 4, 7, 5,
    1, 0, 3, 3, 6, 7,
    7, 8, 5, 5, 2, 1
  ])

  return geometry
}
