const files = {
  'h2o': new Map(),
  'mlg': new Map(),
  'mob': new Map(),
  'mss': new Map(),
  'pba': new Map(),
  'pra': new Map(),
  'pte': new Map(),
  'ptx': new Map(),
  'pve': new Map()
}

function getEntries(reader) {
  return new Promise((resolve, reject) => {
    reader.readEntries(resolve, reject)
  })
}

async function readDirectory(reader) {
  let items = await getEntries(reader)
  const found = []

  while (items.length > 0) {
    found.push(...items)
    items = await getEntries(reader)
  }

  return found
}

async function *iterateItems(items) {
  const queue = []

  for (const item of items) {
    if (item.kind == 'file') {
      queue.push(item.webkitGetAsEntry())
    }
  }

  while (queue.length > 0) {
    const entry = queue.shift()

    if (entry.isDirectory) {
      queue.push(...await readDirectory(entry.createReader()))
    } else if (entry.isFile) {
      yield entry
    }
  }
}

function findItem(str) {
  const s = str.toLowerCase()
  const map = files[s.slice(s.lastIndexOf('.') + 1)]
  let file

  for (const path of map.keys()) {
    if (path.endsWith(s)) {
      file = map.get(path)
      break
    }
  }

  return file
}

export async function load(items) {
  const added = []

  for await (const file of iterateItems(items)) {
    const i = file.name.lastIndexOf('.')
    if (i == -1) continue

    const map = files[file.name.slice(i + 1).toLowerCase()]
    if (!map) continue

    map.set(file.fullPath.toLowerCase(), file)
    added.push(file)
  }

  return added
}

export function readText(path) {
  return new Promise((resolve, reject) => {
    findItem(path).file(file => {
      const reader = new FileReader()
      reader.addEventListener('loadend', () => resolve(reader.result))
      reader.addEventListener('error', reject)
      reader.readAsText(file)
    }, reject)
  })
}

export function read(path) {
  return new Promise((resolve, reject) => {
    findItem(path).file(file => {
      const reader = new FileReader()
      reader.addEventListener('loadend', () => resolve(reader.result))
      reader.addEventListener('error', reject)
      reader.readAsArrayBuffer(file)
    }, reject)
  })
}
