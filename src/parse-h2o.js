import createCursor from './create-cursor.js'

export default function(buffer) {
  const cursor = createCursor(buffer)
  const h2o = {}

  h2o.format = cursor.readUint()

  cursor.push()

  const numTextures = cursor.readUint()
  h2o.textures = []

  for (var i = 0; i < numTextures; i++) {
    const texture = {}

    texture.unknown = cursor.readChars(6)
    texture.image = Uint8Array.from({ length: (256 ** 2) * 4 }, cursor.readUchar, cursor)

    h2o.textures.push(texture)
  }

  const numGeometries = cursor.readUint()
  h2o.geometries = []

  for (let i = 0; i < numGeometries; i++) {
    const geometry = {}

    cursor.push()

    geometry.unknown = Float32Array.from({ length: 8 }, cursor.readFloat, cursor)
    geometry.direction = Float32Array.from({ length: 4 }, cursor.readFloat, cursor)
    geometry.vertices = readVertices(cursor)
    geometry.indices = Array.from({ length: cursor.readUint() }, cursor.readUshort, cursor)

    h2o.geometries.push(geometry)
  }

  return h2o

  function readVertices(cursor) {
    const numVertices = cursor.readUint()
    const points = []
    const colors = []
    const uv = []

    for (let i = 0; i < numVertices; i++) {
      points.push(cursor.readFloat())
      points.push(cursor.readFloat())
      points.push(cursor.readFloat())

      colors.push(cursor.readUchar())
      colors.push(cursor.readUchar())
      colors.push(cursor.readUchar())
      colors.push(cursor.readUchar())

      uv.push(cursor.readFloat())
      uv.push(cursor.readFloat())
    }

    return {
      numVertices,
      points,
      colors,
      uv,
    }
  }
}
