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
    this.mission = parseMSS(await Registry.readText(name))
    this.resources.forEach(r => r.dispose())
    this.resources.clear()

    const tiles = loadTile()
    const nature = loadNature()
    const water = loadWater()

    this.tile = new Group()
    this.tile.name = 'tile'
    this.tile.add(await tiles)

    this.nature = new Group()
    this.nature.name = 'nature'
    this.nature.add(...await nature)

    this.water = new Group()
    this.water.name = 'water'
    this.water.add(...await water)
  },

  update(time) {
    this.timeUniform.value = time
  },

  setTerrainType(value) {
    if (!this.tile) return

    const attribute = this.tile.children[0].geometry.attributes.aFlag

    for (const [i, logic] of this.mlg.entries()) {
      attribute.array[i * 3 + 1] = (value == (logic & Masks.TERRAIN) >> 27) ? 1 : 0
    }

    attribute.needsUpdate = true
  },

  setTerrainLogic(value) {
    if (!this.tile) return

    const attribute = this.tile.children[0].geometry.attributes.aFlag

    for (const [i, logic] of this.mlg.entries()) {
      attribute.array[i * 3] = (value & logic) ? 1 : 0
    }

    attribute.needsUpdate = true
  },

  setTerrainTile(value) {
    if (!this.tile) return

    const attribute = this.tile.children[0].geometry.attributes.aFlag

    for (const [i, tile] of this.pve.tiles.entries()) {
      attribute.array[i * 3 + 2] = (value & tile.flags) ? 1 : 0
    }

    attribute.needsUpdate = true
  }
}

export default {
  timeUniform: new Uniform(0),
  resources: new Set(),
  mission: null,
  nature: null,
  water: null,
  tile: null,
  pve: null,
  mlg: null,
  ...Viewer
}
