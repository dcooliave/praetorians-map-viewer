export const Masks = {
  LOGIC:   0x07ffffff,
  TERRAIN: 0xf8000000,
}

export const TileLogic = {
  NONE:               0,
  NOPASSABLE:         1,
  FLAT:               1 << 4,
  TILT1:              1 << 5,
  TILT2:              1 << 6,
  TILT3:              1 << 7,
  STRUCTURE:          1 << 8,
  BRIDGE:             1 << 9,
  MODIFIED:           1 << 10,
  DOOR:               1 << 11,
  NO_SIEGE:           1 << 12,
  BUILDABLE:          1 << 13,
  WALL_OPEN:          1 << 14,
  WALL_BLOCKED:       1 << 15,
  FORTRESS:           1 << 16,
  BLOCKED_BUILD:      1 << 17,
  CALCULO_IA:         1 << 18,
  FLAT_STRUCTURE:     1 << 19,
  SCENERY_END:        1 << 20,
  WALL_GROUND:        1 << 21,
  BLOCK_WAR_MACHINES: 1 << 22,
}

export const TileTypes = {
  NORMAL:      0,
  SAND:        1,
  DEEP_WATER:  2,
  SHORE:       3,
  GRASSFIELD:  4,
  LIGHT_TREES: 5,
  FOREST:      6,
  WALL:        7,
  BLOCKED:     8,
  SNOW:        9,
  UNUSED:      10,
  SCENERY_END: 11,
}

export default function(buffer) {
  const data = new DataView(buffer)
  const count = data.getUint32(0, true) * data.getUint32(4, true)

  return buffer.slice(8, 8 + count * 4)
}
