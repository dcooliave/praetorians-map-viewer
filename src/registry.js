export const files = {
  'h2o': new Map(),
  'mis': new Map(),
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

export default async function(items) {
  for await (const file of iterateItems(items)) {
    if (file.name[file.name.length - 4] == '.') {
      const ext = file.name.slice(-3).toLowerCase()
      files[ext]?.set(file.fullPath.toLowerCase(), file)
    }
  }
}
