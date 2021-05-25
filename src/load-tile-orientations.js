import { InstancedBufferAttribute } from './three/build/three.module.js'
import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const size = 3
  const data = new Float32Array(pve.tiles.length * size)
  const tileSize = 62 / 64

  for (let i = 0, l = pve.tiles.length; i < l; i++) {
    const tile = pve.tiles[i]
    const ii = i * size

    let rotateUv = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) rotateUv = 0.5
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) rotateUv = 1
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) rotateUv = 1.5

    data[ii] = Math.PI * rotateUv

    // TODO
    data[ii + 1] = data[ii + 2] = tileSize

    if (TileFlags.TEXTURE_MIRRORX & tile.flags) {
      data[ii + 1] *= -1
    }

    if (TileFlags.TEXTURE_MIRRORY & tile.flags) {
      data[ii + 2] *= -1
    }
  }

  return new InstancedBufferAttribute(data, size)
}
