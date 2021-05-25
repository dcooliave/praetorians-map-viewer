import { InstancedBufferAttribute } from './three/build/three.module.js'

export default function(pve) {
  const size = 4
  const data = new Float32Array(pve.tiles.length * size)

  for (let i = 0, l = pve.tiles.length; i < l; i++) {
    const tile = pve.tiles[i]
    const ii = i * size
    data[ii] = tile.blend == -1 ? tile.base : tile.blend
    data[ii + 1] = tile.base
    data[ii + 2] = i % pve.width
    data[ii + 3] = Math.floor(i / pve.width)
  }

  return new InstancedBufferAttribute(data, size)
}
