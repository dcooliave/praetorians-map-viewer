import {
  InterleavedBuffer,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute
} from 'three'

import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const size = 8
  const buffer = new ArrayBuffer(pve.tiles.length * size * 4)
  const floats = new Float32Array(buffer)

  for (let i = 0; i < pve.tiles.length; i++) {
    const tile = pve.tiles[i]
    let offset = i * size

    floats[offset++] = tile.blend == -1 ? tile.base : tile.blend
    floats[offset++] = tile.base

    floats[offset++] = i % pve.width
    floats[offset++] = Math.floor(i / pve.width)

    let rotate = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) rotate = 0.5 * Math.PI
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) rotate = Math.PI
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) rotate = 1.5 * Math.PI

    const si = Math.sin(rotate)
    const co = Math.cos(rotate)

    const mx = (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1
    const my = (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1

    const sc = 0.9

    floats[offset++] = sc * mx * co
    floats[offset++] = sc * mx * si * -1
    floats[offset++] = sc * my * si
    floats[offset++] = sc * my * co
  }

  const floatBuffer = new InstancedInterleavedBuffer(floats, size)

  return {
    layer: new InterleavedBufferAttribute(floatBuffer, 2, 0),
    coordinate: new InterleavedBufferAttribute(floatBuffer, 2, 2),
    orientation: new InterleavedBufferAttribute(floatBuffer, 4, 4)
  }
}
