import { Group, Uniform } from 'three'

import loadMission from './load-mission.js'
import loadNature from './load-nature.js'
import loadTile from './load-tile.js'
import loadWater from './load-water.js'

import { Masks } from './parse-mlg.js'

import registerFiles, { files } from './registry.js'

const Viewer = {
  async initialize(items) {
    await registerFiles(items)

    return [
      ...files.mis.keys(),
      ...files.mss.keys()
    ]
  },

  async build(name) {
    this.nature.clear()
    this.water.clear()
    this.tile.clear()

    this.resources.forEach(r => r.dispose())
    this.resources.clear()

    this.mission = await loadMission(name)

    loadTile()
    loadWater()
    loadNature()
  },

  update(time) {
    this.timeUniform.value = time
  },

  setTerrainType(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      const data = new Uint32Array(this.mission.mlg)

      for (const [i, logic] of data.entries()) {
        attribute.array[i * attribute.data.stride + attribute.offset + 1] = (value == (logic & Masks.TERRAIN) >> 27) ? 1 : 0
      }

      attribute.needsUpdate = true
    })
  },

  setTerrainLogic(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      const data = new Uint32Array(this.mission.mlg)

      for (const [i, logic] of data.entries()) {
        attribute.array[i * attribute.data.stride + attribute.offset] = (value & logic) ? 1 : 0
      }

      attribute.needsUpdate = true
    })
  },

  setTerrainTile(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      for (const [i, tile] of this.mission.pve.tiles.entries()) {
        attribute.array[i * attribute.data.stride + attribute.offset + 2] = (value & tile.flags) ? 1 : 0
      }

      attribute.needsUpdate = true
    })
  }
}

export default {
  timeUniform: new Uniform(0),
  resources: new Set(),
  mission: null,
  nature: new Group(),
  water: new Group(),
  tile: new Group(),
  ...Viewer
}
