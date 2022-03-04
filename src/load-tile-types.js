import { InstancedBufferAttribute } from 'three'

export default function(pve) {
  const count = pve.tiles.length
  return new InstancedBufferAttribute(new Float32Array(count * 3), 3)
}
