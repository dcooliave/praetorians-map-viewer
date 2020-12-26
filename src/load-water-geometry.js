import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute
} from './three.module.js'

export default function(vertices, indices) {
  const geometry = new BufferGeometry()

  const colors = vertices.colors.map(c => c / 255)

  geometry.setAttribute('position', new Float32BufferAttribute(vertices.points, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 4))
  geometry.setAttribute('uv', new Float32BufferAttribute(vertices.uv, 2))
  geometry.setIndex(new Uint16BufferAttribute(indices, 1))

  return geometry
}
