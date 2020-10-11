import { Character, ScriptBase } from '../SloUtils'
import { SlotTracker } from './slotTracker'

const invAttrRegex = new RegExp('^([csegp]p)|repeating_inventory_([^_]*)_(itemcount|itemweight|equipped)')

class _Slot5e extends ScriptBase({
  name: 'Slot5e',
  version: '0.3.1',
  stateKey: 'SLOT_5E',
  initialState: {},
}) {
  log = (msg) => log(`${this.name}: ${msg}`)

  constructor() {
    super()
    this.trackers = {}

    on('ready', () => {
      on('add:attribute', this.onAddAttribute)
      on('change:attribute', this.onChangeAttribute)
      on('destroy:attribute', this.onDestroyAttribute)
      on('add:character', this.onAddCharacter)
      on('destroy:character', this.onDestroyCharacter)

      const chars = findObjs({
        _type: 'character',
        archived: false,
      }).filter((char) => String(getAttrByName(char.id, 'npc')) !== '1')

      for (const char of chars) {
        this.log(`Adding tracker for ${char.get('name')}`)
        this.trackers[char.id] = new SlotTracker(Character.fromId(char.id))
        this.trackers[char.id].update()
      }
    })

    this.parser = new CommandParser('!slot5e')
      .default(() => {
        let names = []
        for (const id in this.trackers) {
          this.trackers[id].update()
          names.push(this.trackers[id].charName)
        }
        sendChat(this.name, `Manually updated slots for ${names.join(', ')}`)
      })
      .command('container', (opts, msg) => {
        const name = opts._.join(' ') || 'Container'
        const containerChar = createObj('character', {
          name,
          inplayerjournals: 'all',
          controlledby: 'all',
        })
        const container = Character.fromId(containerChar.id)
        container.size = 'Container'
        container.npc = '0'
        container.class_resource_name = 'Capacity'
        container.class_resource = opts.slots
        container.mancer_cancel = 'on'
        sendChat(this.name, `Created container "${name}"`)
      })
  }

  getTrackerForId(id) {
    if (!(id in this.trackers)) {
      this.trackers[id] = new SlotTracker(Character.fromId(id))
    }
    return this.trackers[id]
  }

  onAddAttribute = (attr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onChangeAttribute = (attr, oldAttr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onDestroyAttribute = (attr) => {
    if (attr.get('name').match(invAttrRegex)) {
      this.getTrackerForId(attr.get('_characterid')).update()
    }
  }

  onAddCharacter = (char) => {
    this.log(`Adding tracker for ${char.get('name')}`)
    this.trackers[char.id] = new SlotTracker(Character.fromId(char.id))
    this.trackers[char.id].update()
  }

  onDestroyCharacter = (char) => {
    this.log(`Removing tracker for ${char.get('name')}`)
    delete this.pcs[char.id]
  }
}

const Slot5e = new _Slot5e()
