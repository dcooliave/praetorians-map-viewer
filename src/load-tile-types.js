import { InstancedBufferAttribute } from './three/build/three.module.js'

export default function(pve) {
  const count = pve.tiles.length
  return new InstancedBufferAttribute(new Float32Array(count * 3), 3)
}
