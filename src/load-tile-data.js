import {
  InterleavedBuffer,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute
} from 'three'

import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const size = 7
  const buffer = new ArrayBuffer(pve.tiles.length * size * 4)
  const floats = new Float32Array(buffer)

  for (let i = 0; i < pve.tiles.length; i++) {
    const tile = pve.tiles[i]
    let offset = i * size

    floats[offset++] = tile.blend == -1 ? tile.base : tile.blend
    floats[offset++] = tile.base

    floats[offset++] = i % pve.width
    floats[offset++] = Math.floor(i / pve.width)

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) {
      floats[offset++] = Math.PI * .5
    } else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) {
      floats[offset++] = Math.PI
    } else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) {
      floats[offset++] = Math.PI * 1.5
    } else {
      floats[offset++] = 0
    }

    floats[offset++] = (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1
    floats[offset++] = (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1
  }

  const floatBuffer = new InstancedInterleavedBuffer(floats, size)

  return {
    layer: new InterleavedBufferAttribute(floatBuffer, 2, 0),
    coordinate: new InterleavedBufferAttribute(floatBuffer, 2, 2),
    orientation: new InterleavedBufferAttribute(floatBuffer, 3, 4)
  }
}
