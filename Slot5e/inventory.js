import { Character, elements, menuWithHeader, randomId } from '../SloUtils'
import { link } from './ui'
const { ul, li, b } = elements

/**
 * @typedef {Object} InvItem
 * @param {string} [itemname]
 * @param {string} [itemcount]
 * @param {string} [itemweight]
 * @param {string} [itemdesc]
 * @param {string} [rowId]
 */

/**
 * @typedef {Object} Item
 * @property {string} id - The row ID if this is an inventory item, or a random ID if this is a ground item
 * @property {string} name
 * @property {number} bulk - The number of slots this item occupies
 * @property {number} count - The quantity of this item that exists
 * @property {string} [desc] - A description of the item
 * @property {"ground" | string} location - The ID of the character that holds this item. Will be "ground" if it is not held.
 */

/**
 *
 * @param {InvItem} invItem
 * @returns {Item}
 */
const fromInvItem = (invItem) => {
  /** @type Item */
  let item = { id: invItem.rowId }
  item.name = invItem.itemname || 'Unnamed Item'

  item.bulk = parseFloat(invItem.itemweight)
  if (isNaN(item.bulk)) item.bulk = 0

  item.count = parseInt(invItem.itemcount)
  if (isNaN(item.count)) item.count = 1

  item.desc = invItem.itemdesc
  return item
}

/**
 * @param {string} itemId
 * @param {string} charId
 * @returns {Item?}
 */
export const getItemFromInventory = (itemId, charId) => {
  let reg = new RegExp(`repeating_inventory_${itemId}_([^_]*)`)
  let rawItem = { rowId: itemId }

  findObjs({ characterid: charId, type: 'attribute' }).forEach((attr) => {
    let match = attr.get('name').match(reg)
    if (match && match[1]) {
      rawItem[match[1]] = attr.get('current')
    }
  })

  if (Object.keys(rawItem).length === 1) {
    throw new Error(`Unable to find item ${itemId} for character ${charId}!`)
  }

  /** @type Item */
  return { ...fromInvItem(rawItem), location: charId }
}

/**
 * Adds item to inventory. If the character has an item with matching
 * name, bulk, and desc, it will update the quantity instead.
 * @param {Item} item
 * @param {number} count
 * @param {string} charId
 * @returns {Item} The inventory item created on the character
 */
export const pickupItem = (item, count, charId) => {
  const character = Character.fromId(charId)
  for (const invItem of character.repeating.inventory) {
    const name = invItem.itemname
    let bulk = parseFloat(invItem.itemweight)
    if (isNaN(bulk)) bulk = 0
    let desc = invItem.itemdesc

    if (name === item.name && bulk === item.bulk && desc === item.desc) {
      invItem.itemcount += count
      return { ...fromInvItem(invItem), location: charId }
    }
  }

  let invItem = {
    itemname: item.name,
    itemcount: count,
    itemweight: item.bulk,
    itemdesc: item.desc,
  }
  const newItemId = character.repeating.inventory.addRow(invItem)
  return { ...fromInvItem({ ...invItem, rowId: newItemId }), location: charId }
}

/**
 * Removes an item from an inventory. If the inventory has more
 * items than `count`, decrements the quantity instead.
 * @param {string} itemId
 * @param {number} count
 * @param {string} charId
 * @returns {Item} The ground item dropped
 */
export const dropItem = (itemId, count, charId) => {
  const character = Character.fromId(charId)
  for (const invItem of character.repeating.inventory) {
    if (invItem.rowId === itemId) {
      const groundItem = fromInvItem(invItem)
      let invItemCount = groundItem.count

      if (count >= invItemCount) {
        invItem.delRow()
      } else {
        invItem.itemcount = invItemCount - count
      }

      groundItem.id = randomId()
      groundItem.count = count
      groundItem.location = 'ground'
      return groundItem
    }
  }
}

/**
 * @param {Item} item
 * @param {{ title: string, href: string }[]} actions
 * @returns {string}
 */
export const showItemCard = (item, actions) => {
  let striped = false
  const row = (key, ...vals) => {
    let renderedRow = li({ style: { backgroundColor: striped ? 'lightgrey' : 'white' } }, b(`${key}: `), ...vals)
    striped = !striped
    return renderedRow
  }

  return menuWithHeader(
    item.name,
    ul(
      { style: 'padding:0;margin:0;list-style:none;' },
      row('Quantity', item.count),
      row('Bulk', item.bulk),
      item.location === 'ground'
        ? null
        : row(
            'Holder',
            link(getObj('character', item.location).get('name'), `!slot5e listInventory --charId=${item.location}`)
          ),
      item.desc ? row('Description', item.desc) : null,
      actions ? row('Actions', ...actions.map(({ title, href }) => link(title, href))) : null
    )
  )
}
