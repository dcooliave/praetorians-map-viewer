import { InstancedBufferAttribute } from './three/build/three.module.js'
import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const size = 3
  const data = new Float32Array(pve.tiles.length * size)

  for (let i = 0, l = pve.tiles.length; i < l; i++) {
    const tile = pve.tiles[i]

    let rotateUv = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) rotateUv = 0.5
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) rotateUv = 1
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) rotateUv = 1.5

    data[i * size] = Math.PI * rotateUv
    data[i * size + 1] = (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1
    data[i * size + 2] = (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1
  }

  return new InstancedBufferAttribute(data, size)
}
