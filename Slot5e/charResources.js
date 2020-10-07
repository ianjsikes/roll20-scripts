import { generateRowID } from '../SloUtils'

class Resource {
  constructor(side, nameAttr, valAttr) {
    this.side = side
    this.nameAttr = nameAttr
    this.valAttr = valAttr
  }

  get name() {
    return this.nameAttr.get('current')
  }

  set name(n) {
    this.nameAttr.setWithWorker({ current: n })
  }

  get curr() {
    return this.valAttr.get('current')
  }

  set curr(c) {
    this.valAttr.set({ current: c })
  }

  get max() {
    return this.valAttr.get('max')
  }

  set max(m) {
    this.valAttr.set({ max: m })
  }
}

export class CharResources {
  constructor(id) {
    this.id = id
    this.resourceAttrsByRow = {}
    this.rows = []

    let resourceRegex = new RegExp('repeating_resource_([^_]*)_resource_(left|right)(_name)?')
    findObjs({ characterid: id, type: 'attribute' }).forEach((attr) => {
      var match = attr.get('name').match(resourceRegex)
      if (match) {
        const [name, row, side, isNameAttr] = match
        if (!(row in this.resourceAttrsByRow)) {
          this.resourceAttrsByRow[row] = {}
        }
        if (!(side in this.resourceAttrsByRow[row])) {
          this.resourceAttrsByRow[row][side] = {}
        }
        if (isNameAttr) {
          this.resourceAttrsByRow[row][side].nameAttr = attr
        } else {
          this.resourceAttrsByRow[row][side].valAttr = attr
        }
      }
    })

    for (const rowId in this.resourceAttrsByRow) {
      const row = this.resourceAttrsByRow[rowId]
      let resVals = []
      if (row.left && row.left.nameAttr && row.left.valAttr) {
        resVals.push(new Resource('left', row.left.nameAttr, row.left.valAttr))
      }
      if (row.right && row.right.nameAttr && row.right.valAttr) {
        resVals.push(new Resource('right', row.right.nameAttr, row.right.valAttr))
      }
      this.rows.push(resVals)
    }
  }

  addRow(left = null, right = null) {
    let rowId = generateRowID()

    const makeAttr = (suffix, curr, max) => {
      const attr = createObj('attribute', {
        characterid: this.id,
        name: `${prefix}${suffix}`,
        current: '',
      })
      if (curr) attr.setWithWorker({ current: curr })
      if (max) attr.setWithWorker({ max })
      return attr
    }

    this.resourceAttrsByRow[rowId] = {}
    let prefix = `repeating_resource_${rowId}_resource_`

    const leftNameAttr = makeAttr('left_name', left && left.name)
    const leftValAttr = makeAttr('left', left && left.curr, left && left.max)
    this.resourceAttrsByRow[rowId].left = { nameAttr: leftNameAttr, valAttr: leftValAttr }
    const leftRes = new Resource('left', leftNameAttr, leftValAttr)

    const rightNameAttr = makeAttr('right_name', right && right.name)
    const rightValAttr = makeAttr('right', right && right.curr, right && right.max)
    this.resourceAttrsByRow[rowId].right = { nameAttr: rightNameAttr, valAttr: rightValAttr }
    const rightRes = new Resource('right', rightNameAttr, rightValAttr)

    this.rows.push([leftRes, rightRes])
    return [leftRes, rightRes]
  }

  getOrCreateByName(name) {
    for (const row of this.rows) {
      for (const res of row) {
        if (res.name.startsWith(name)) return res
      }
    }

    const [left] = this.addRow({ name })
    return left
  }
}
