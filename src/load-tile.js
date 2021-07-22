import { Mesh, Object3D, Uniform } from './three/build/three.module.js'

import loadTileTexture from './load-tile-texture.js'
import loadTileDataset from './load-tile-dataset.js'
import loadTileMaterial from './load-tile-material.js'
import loadTileLayers from './load-tile-layers.js'
import loadTileCoordinates from './load-tile-coordinates.js'
import loadTileOrientations from './load-tile-orientations.js'
import loadTileTypes from './load-tile-types.js'
import loadTileGeometry from './load-tile-geometry.js'

import Viewer from './viewer.js'

export default function() {
  const { mission } = Viewer

  const pveData = mission.pve
  const pteData = mission.pte

  const instanceCount = pveData.tiles.length
  const instanceLayer = loadTileLayers(pveData)
  const instanceCoord = loadTileCoordinates(pveData)
  const instanceOrientation = loadTileOrientations(pveData)
  const instanceType = loadTileTypes(pveData)

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
  geometry.setAttribute('aLayer', instanceLayer)
  geometry.setAttribute('aCoordinate', instanceCoord)
  geometry.setAttribute('aOrientation', instanceOrientation)
  geometry.setAttribute('aFlag', instanceType)
  geometry.instanceCount = instanceCount

  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.matrixAutoUpdate = false

  Viewer.resources.add(texture)
  Viewer.resources.add(dataset)
  Viewer.resources.add(material)
  Viewer.resources.add(geometry)
  Viewer.tile.add(mesh)
}
