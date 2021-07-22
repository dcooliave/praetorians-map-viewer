import {
  InterleavedBuffer,
  InstancedBufferGeometry,
  InterleavedBufferAttribute
} from './three/build/three.module.js'

export default function() {
  const size = 5
  const data = []

  for (let y = 0; y < 3; y++) {
    const w = y * 0.5

    for (let x = 0; x < 3; x++) {
      const z = x * 0.5

      data.push(z, 0, w, z, w)
    }
  }

  const buffer = new InterleavedBuffer(new Float32Array(data), size)

  const geometry = new InstancedBufferGeometry()
  geometry.setAttribute('position', new InterleavedBufferAttribute(buffer, 3, 0))
  geometry.setAttribute('uv', new InterleavedBufferAttribute(buffer, 2, 3))
  geometry.setIndex([
    4, 5, 1, 4, 1, 3,
    4, 3, 7, 4, 7, 5,
    1, 0, 3, 3, 6, 7,
    7, 8, 5, 5, 2, 1
  ])

  return geometry
}
