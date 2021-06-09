import {
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  Uniform
} from './three/build/three.module.js'

import loadTileTexture from './load-tile-texture.js'
import loadTileDataset from './load-tile-dataset.js'
import loadTileMaterial from './load-tile-material.js'
import loadTileCoordinates from './load-tile-coordinates.js'
import loadTileOrientations from './load-tile-orientations.js'
import loadTileGeometry from './load-tile-geometry.js'

import * as Registry from './registry.js'
import Viewer from './viewer.js'

export default async function() {
  const { mission } = Viewer

  const pveData = mission.pve
  const pteData = mission.pte

  const instanceCount = pveData.tiles.length
  const instanceCoord = loadTileCoordinates(pveData)
  const instanceOrientation = loadTileOrientations(pveData)
  const instanceType = new InstancedBufferAttribute(new Float32Array(instanceCount * 3), 3)

  const texture = loadTileTexture(pteData)
  const dataset = loadTileDataset(pveData)

  const material = loadTileMaterial()
  material.uniforms.uDataset = new Uniform(dataset)
  material.uniforms.uTexture = new Uniform(texture)
  material.uniforms.uElevation = new Uniform(new Float32Array([
    pveData.maxHeight,
    pveData.minHeight
  ]))

  const geometry = loadTileGeometry()
  geometry.setAttribute('aCoordinate', instanceCoord)
  geometry.setAttribute('aOrientation', instanceOrientation)
  geometry.setAttribute('aFlag', instanceType)

  const mesh = new InstancedMesh(geometry, material, instanceCount)
  const dummy = new Object3D()

  for (let z = 0; z < pveData.length; z++) {
    for (let x = 0; x < pveData.width; x++) {
      const tileIndex = z * pveData.width + x
      dummy.position.set(x, 0, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(tileIndex, dummy.matrix)
    }
  }

  Viewer.resources.add(texture)
  Viewer.resources.add(dataset)
  Viewer.resources.add(material)
  Viewer.resources.add(geometry)
  Viewer.tile.add(mesh)
}
