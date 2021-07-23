import {
  InterleavedBuffer,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute
} from './three/build/three.module.js'

import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const size = 7
  const data = []

  for (const [i, tile] of pve.tiles.entries()) {
    let uvRotate = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) uvRotate = .5
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) uvRotate = 1
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) uvRotate = 1.5

    data.push(
      tile.blend == -1 ? tile.base : tile.blend,
      tile.base,

      i % pve.width,
      Math.floor(i / pve.width),

      uvRotate * Math.PI,
      (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1,
      (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1
    )
  }

  const buffer = new InstancedInterleavedBuffer(new Float32Array(data), size)

  return {
    layer: new InterleavedBufferAttribute(buffer, 2, 0),
    coordinate: new InterleavedBufferAttribute(buffer, 2, 2),
    orientation: new InterleavedBufferAttribute(buffer, 3, 4)
  }
}
