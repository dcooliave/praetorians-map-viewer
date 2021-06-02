import { Group, Uniform } from './three/build/three.module.js'

import loadNature from './load-nature.js'
import loadTile from './load-tile.js'
import loadWater from './load-water.js'

import { Masks } from './parse-mlg.js'
import parseMSS from './parse-mss.js'

import Registry from './registry.js'

const Viewer = {
  async initialize(items) {
    const registry = await Registry.load(items)
    const type = /\.(mss|mis)$/i

    return registry.filter(f => type.test(f.fullPath))
  },

  async build(name) {
    this.nature.clear()
    this.water.clear()
    this.tile.clear()

    this.resources.forEach(r => r.dispose())
    this.resources.clear()

    this.mission = parseMSS(await Registry.readText(name))

    await Promise.all([loadTile(), loadWater(), loadNature()])
  },

  update(time) {
    this.timeUniform.value = time
  },

  setTerrainType(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      for (const [i, logic] of this.mlg.entries()) {
        attribute.array[i * 3 + 1] = (value == (logic & Masks.TERRAIN) >> 27) ? 1 : 0
      }

      attribute.needsUpdate = true
    })
  },

  setTerrainLogic(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      for (const [i, logic] of this.mlg.entries()) {
        attribute.array[i * 3] = (value & logic) ? 1 : 0
      }

      attribute.needsUpdate = true
    })
  },

  setTerrainTile(value) {
    this.tile.traverse(child => {
      if (child.type != 'Mesh') return

      const attribute = child.geometry.attributes.aFlag
      for (const [i, tile] of this.pve.tiles.entries()) {
        attribute.array[i * 3 + 2] = (value & tile.flags) ? 1 : 0
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
  pve: null,
  mlg: null,
  ...Viewer
}
