import {
  BufferGeometry,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  BufferAttribute
} from 'three'

export default function(vertices, indices) {
  const floats = new InterleavedBuffer(new Float32Array(vertices), 6)
  const bytes = new InterleavedBuffer(new Uint8Array(vertices), 24)

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new InterleavedBufferAttribute(floats, 3, 0))
  geometry.setAttribute('color', new InterleavedBufferAttribute(bytes, 4, 12, true))
  geometry.setAttribute('uv', new InterleavedBufferAttribute(floats, 2, 4))
  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1))

  return geometry
}
