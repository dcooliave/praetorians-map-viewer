import { InstancedBufferAttribute } from './three/build/three.module.js'

export default function(pve) {
  const size = 2
  const data = new Float32Array(pve.tiles.length * size)

  for (let i = 0; i < pve.tiles.length; i++) {
    const tile = pve.tiles[i]
    data[i * size] = tile.blend == -1 ? tile.base : tile.blend
    data[i * size + 1] = tile.base
  }

  return new InstancedBufferAttribute(data, size)
}
