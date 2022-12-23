import { Mesh, Uniform } from 'three'

import loadTileTexture from './load-tile-texture.js'
import loadTileDataset from './load-tile-dataset.js'
import loadTileMaterial from './load-tile-material.js'
import loadTileData from './load-tile-data.js'
import loadTileGeometry from './load-tile-geometry.js'

import Viewer from './viewer.js'

export default function() {
  const { mission } = Viewer

  const pveData = mission.pve
  const pteData = mission.pte

  const instanceCount = pveData.tiles.length
  const instanceData = loadTileData(pveData)

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
  geometry.setAttribute('aLayer', instanceData.layer)
  geometry.setAttribute('aOrientation', instanceData.orientation)
  geometry.setAttribute('aFlag', instanceData.type)
  geometry.instanceCount = instanceCount

  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.matrixAutoUpdate = false
  mesh.matrix.makeScale(1, 1, -1)

  Viewer.resources.add(texture)
  Viewer.resources.add(dataset)
  Viewer.resources.add(material)
  Viewer.resources.add(geometry)
  Viewer.tile.add(mesh)
}
