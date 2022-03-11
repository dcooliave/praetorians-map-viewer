import {
  InterleavedBuffer,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute
} from 'three'

import { TileFlags } from './parse-pve.js'

export default function(pve) {
  const block = 24
  const buffer = new ArrayBuffer(pve.tiles.length * block)
  const data = new DataView(buffer)

  for (let i = 0; i < pve.tiles.length; i++) {
    const tile = pve.tiles[i]
    const offset = i * block

    data.setUint16(offset, tile.blend == -1 ? tile.base : tile.blend, true)
    data.setUint16(offset + 2, tile.base, true)

    data.setUint16(offset + 4, i % pve.width, true)
    data.setUint16(offset + 6, Math.floor(i / pve.width), true)

    let rotate = 0

    if (TileFlags.TEXTURE_ROTATE90 & tile.flags) rotate = 0.5 * Math.PI
    else if (TileFlags.TEXTURE_ROTATE180 & tile.flags) rotate = Math.PI
    else if (TileFlags.TEXTURE_ROTATE270 & tile.flags) rotate = 1.5 * Math.PI

    const si = Math.sin(rotate)
    const co = Math.cos(rotate)

    const mx = (TileFlags.TEXTURE_MIRRORX & tile.flags) ? -1 : 1
    const my = (TileFlags.TEXTURE_MIRRORY & tile.flags) ? -1 : 1

    const sc = 0.9

    data.setFloat32(offset + 8, sc * mx * co, true)
    data.setFloat32(offset + 12, sc * mx * si * -1, true)
    data.setFloat32(offset + 16, sc * my * si, true)
    data.setFloat32(offset + 20, sc * my * co, true)
  }

  const shorts = new InstancedInterleavedBuffer(new Uint16Array(buffer), block / 2)
  const floats = new InstancedInterleavedBuffer(new Float32Array(buffer), block / 4)

  return {
    layer: new InterleavedBufferAttribute(shorts, 4, 0),
    orientation: new InterleavedBufferAttribute(floats, 4, 2)
  }
}
