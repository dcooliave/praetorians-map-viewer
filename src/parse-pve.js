export const TileFlags = {
  QUAD0_DIAGONAL:    0x0001,
  QUAD1_DIAGONAL:    0x0002,
  QUAD2_DIAGONAL:    0x0004,
  QUAD3_DIAGONAL:    0x0008,
  TEXTURE_ROTATE90:  0x0010,
  TEXTURE_ROTATE180: 0x0020,
  TEXTURE_ROTATE270: 0x0040,
  TEXTURE_MIRRORX:   0x0080,
  TEXTURE_MIRRORY:   0x0100,
  DYNAMIC_MIX:       0x0200,
  TILE_NOTESSELLATE: 0x0400,
  TILE_FLAT:         0x0800,
  TILE_VISIBLE:      0x8000,
}

export default function(buffer) {
  const data = new DataView(buffer)
  const pve = {}

  pve.width = data.getUint32(4, true)
  pve.length = data.getUint32(8, true)
  pve.maxHeight = data.getFloat32(12, true)
  pve.minHeight = data.getFloat32(16, true)

  const numTiles = pve.width * pve.length
  pve.tiles = []

  let pointer = 20

  for (let i = 0; i < numTiles; i++) {
    pve.tiles.push({
      base: data.getInt16(pointer, true),
      blend: data.getInt16(pointer + 2, true),
      flags: data.getUint16(pointer + 4, true),
      height: data.getInt16(pointer + 6, true)
    })

    pointer += 8
  }

  const numVertices = (pve.width * 2 + 1) * (pve.length * 2 + 1)
  pve.heights = buffer.slice(pointer, pointer + numVertices)
  pointer += pve.heights.byteLength
  pve.colors = buffer.slice(pointer, pointer + numVertices * 4)

  return pve
}
