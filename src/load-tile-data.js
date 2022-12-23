import {
  InterleavedBuffer,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute
} from 'three'

import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const block = Float32Array.BYTES_PER_ELEMENT * 11
  const buffer = new ArrayBuffer(pve.tiles.length * block)
  const data = new DataView(buffer)

  for (let i = 0; i < pve.tiles.length; i++) {
    const tile = pve.tiles[i]
    const offset = i * block

    data.setFloat32(offset, tile.blend == -1 ? tile.base : tile.blend, true)
    data.setFloat32(offset + 4, tile.base, true)

    data.setFloat32(offset + 8, i % pve.width, true)
    data.setFloat32(offset + 12, Math.floor(i / pve.width), true)

    let rotate = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) rotate = 0.5 * Math.PI
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) rotate = Math.PI
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) rotate = 1.5 * Math.PI

    const si = Math.sin(rotate)
    const co = Math.cos(rotate)

    const mx = (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1
    const my = (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1

    const sc = 0.9

    data.setFloat32(offset + 16, sc * mx * co, true)
    data.setFloat32(offset + 20, sc * mx * si * -1, true)
    data.setFloat32(offset + 24, sc * my * si, true)
    data.setFloat32(offset + 28, sc * my * co, true)

    data.setFloat32(offset + 32, 0, true)
    data.setFloat32(offset + 36, 0, true)
    data.setFloat32(offset + 40, 0, true)
  }

  const floats = new InstancedInterleavedBuffer(new Float32Array(buffer), block / 4)

  return {
    layer: new InterleavedBufferAttribute(floats, 4, 0),
    orientation: new InterleavedBufferAttribute(floats, 4, 4),
    type: new InterleavedBufferAttribute(floats, 4, 8)
  }
}
