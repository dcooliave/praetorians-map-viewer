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
    texture.image = cursor.buffer((256 ** 2) * 4)

    h2o.textures.push(texture)
  }

  const numGeometries = cursor.readUint()
  h2o.geometries = []

  for (let i = 0; i < numGeometries; i++) {
    const geometry = {}

    cursor.push()

    geometry.unknown = Float32Array.from({ length: 8 }, cursor.readFloat, cursor)
    geometry.direction = Float32Array.from({ length: 4 }, cursor.readFloat, cursor)
    geometry.vertices = cursor.buffer(cursor.readUint() * 24)
    geometry.indices = cursor.buffer(cursor.readUint() * 2)

    h2o.geometries.push(geometry)
  }

  return h2o

}
