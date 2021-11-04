import createCursor from './create-cursor.js'

export const ModelType = {
  RIGIDA:    1,
  FLEXIBLE:  2,
  ANIMADA:   3,
  NODOS:     4,
  UNDEFINED: 5
}

export const MaterialType = {
  NONE:      0,
  ALPHA:     1,
  ALPHATEST: 2,
  SHADOW:    3
}

function readVertices(cursor) {
  return cursor.buffer(cursor.readUint() * 36)
}

function readTransform(cursor) {
  return {
    name: cursor.readString(),
    parent: cursor.readInt(),
    rotation: Float32Array.from({ length: 4 }, cursor.readFloat, cursor),
    translation: Float32Array.from({ length: 3 }, cursor.readFloat, cursor)
  }
}

function readRigidGeometry(cursor, format) {
  const geometry = {}
  const numSurfaces = cursor.readUint()
  geometry.surfaces = []
  geometry.vertices = []

  for (let i = 0; i < numSurfaces; i++) {
    const surface = {}

    surface.textureID = cursor.readInt()
    surface.materialFlags = cursor.readUint()
    surface.indices = cursor.buffer(cursor.readUint() * 2)

    const numTextures = (format == 1) ? 0 : cursor.readUint()
    surface.alternateTextures = Array.from({ length: numTextures }, cursor.readString, cursor)

    geometry.surfaces.push(surface)
  }

  for (let i = 0; i < numSurfaces; i++) {
    geometry.vertices.push(readVertices(cursor))
  }

  return geometry
}

function readAnimatedGeometry(cursor, format) {
  const geometry = {}
  geometry.vertices = readVertices(cursor)

  const numSurfaces = cursor.readUint()
  geometry.surfaces = []

  for (let i = 0; i < numSurfaces; i++) {
    const surface = {}

    surface.textureID = cursor.readInt()
    surface.materialFlags = cursor.readUint()
    surface.numVertices = cursor.readUint()
    surface.indices = cursor.buffer(cursor.readUint() * 2)

    const numTextures = (format == 1) ? 0 : cursor.readUint()
    surface.alternateTextures = Array.from({ length: numTextures }, cursor.readString, cursor)

    geometry.surfaces.push(surface)
  }

  return geometry
}

function readMesh(cursor, format) {
  cursor.push()

  const mesh = {}
  mesh.type = cursor.readUint()
  mesh.name = cursor.readString()
  mesh.sphere = Float32Array.from({ length: 4 }, cursor.readFloat, cursor)

  if (mesh.type == ModelType.RIGIDA) {
    mesh.geometry = readRigidGeometry(cursor, format)
  } else if (mesh.type == ModelType.ANIMADA) {
    mesh.geometry = readAnimatedGeometry(cursor, format)
  } else {
    console.log("Cannot parse geometry")
    cursor.skip()
  }

  return mesh
}

export default function(buffer) {
  const cursor = createCursor(buffer)
  const pba = {}

  pba.format = cursor.readUint()

  cursor.push()

  pba.name = cursor.readString()

  cursor.push()

  const numTransforms = cursor.readUint()
  pba.transforms = []

  for (let i = 0; i < numTransforms; i++) {
    pba.transforms.push(readTransform(cursor))
  }

  const numTextures = cursor.readUint()
  pba.textures = []

  for (var i = 0; i < numTextures; i++) {
    pba.textures.push(cursor.readString())
  }

  cursor.push()

  const numMeshes = cursor.readUint()
  pba.meshes = []

  for (let i = 0; i < numMeshes; i++) {
    pba.meshes.push(readMesh(cursor, pba.format))
  }

  return pba
}
