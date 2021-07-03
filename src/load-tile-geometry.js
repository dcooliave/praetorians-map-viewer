import {
  Float32BufferAttribute,
  InstancedBufferGeometry
} from './three/build/three.module.js'

export default function() {
  const positions = []
  const uvs = []

  for (let y = 0; y < 3; y++) {
    const w = y * 0.5

    for (let x = 0; x < 3; x++) {
      const z = x * 0.5

      positions.push(z, 0, w)
      uvs.push(z, w)
    }
  }

  const geometry = new InstancedBufferGeometry()

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex([
    4, 5, 1, 4, 1, 3,
    4, 3, 7, 4, 7, 5,
    1, 0, 3, 3, 6, 7,
    7, 8, 5, 5, 2, 1
  ])

  return geometry
}
