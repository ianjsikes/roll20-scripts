import { generateRowID } from './ids'

class RepeatingSection {
  static create(charObj) {
    return new Proxy({ char: charObj }, RepeatingSection.repeatingSectionHandler)
  }

  static repeatingSectionHandler = {
    get: (obj, prop) => {
      //char.repeating.<prop> ->
      var prefixes = []
      var retval = []

      //identify all the repeating elements of the specified type for this character, by identifying the prefix Roll20 uses
      findObjs({ characterid: obj.char.id, type: 'attribute' }).forEach((i) => {
        var m = i.get('name').match(new RegExp(`repeating_${prop}_[^_]*_`))
        if (m != null) prefixes.push(m[0])
      })

      prefixes = [...new Set(prefixes)] //make unique list of prefixes, since these will exist for each parameter

      //now construct our array of repeating objects of the specified type, by creating the Proxy with the repeatingObjHandler and passing in the prefix
      prefixes.forEach((prefix) => {
        var charId = obj.char.id
        var rowPrefix = prefix
        retval.push(
          new Proxy(
            {
              charId: obj.char.id,
              prefix: prefix,
              delRow: () => {
                findObjs({ _characterid: charId, _type: 'attribute' }).forEach((i) => {
                  if (i.get('name').indexOf(rowPrefix) > -1) {
                    log('removing:' + i.get('name'))
                    i.remove()
                  }
                })
              },
            },
            this.repeatingRowHandler
          )
        )
      })

      //these are created locally so they will be promoted into the attached addRow method
      var charId = obj.char.id
      var section = prop
      retval.addRow = function (attribs) {
        var char = Character.fromId(charId)
        var newRowId = generateRowID()
        for (var prop in attribs) {
          var name = `repeating_${section}_${newRowId}_${prop}`
          var obj = createObj('attribute', {
            characterid: charId,
            name: name,
            current: '',
          })
          obj.setWithWorker({ current: attribs[prop] })
        }

        char.forceRecalc = Date.now() //TODO: this is a workersheet item that does not below in the base class
        return newRowId //perhaps search the character for this new item and return it?
      }
      return retval
    },
    set: (obj, prop, value) => {
      return true
    },
  }
  static repeatingRowHandler = {
    //expand the simple property passed in with the prefix and character id, and return the current value
    get: (obj, prop) => {
      if (prop == 'delRow') return obj.delRow
      if (prop == 'prefix') return obj.prefix
      if (prop == 'charId') return obj.charId
      var retval = null
      findObjs({ _characterid: obj.charId, _type: 'attribute', _name: obj.prefix + prop }).forEach((i) => {
        retval = i.get('current')
      })
      //if(retval==null) log(`Warning: Unable to find property "${prop}" Returning NULL. `);
      return retval
    },
    set: (obj, prop, value) => {
      findObjs({ _characterid: obj.charId, _type: 'attribute', _name: obj.prefix + prop }).forEach((i) => {
        i.setWithWorker({ current: value })
      })
      return true
    },
  }
}

export class Character {
  id = null
  repeating = null
  constructor(characterId, suppressWarning = false) {
    this.id = characterId
    if (suppressWarning == false)
      log(
        'WARNING! It is best practice to create Character objects using the factory pattern, to allow for game specific versions of characters.  As such, consider using: Character.fromId(charId); rather than: new Character(charId);'
      )
  }

  static fromId(characterId) {
    var retval = new Character(characterId, true)
    return retval.wrap()
  }
  static fromToken(token) {
    var tokenId = token
    if (typeof token == 'object') tokenId = token.id
    var tokenObj = getObj('graphic', tokenId)
    if (tokenObj == null) return null
    var retval = new Character(tokenObj.get('represents'), true)
    return retval.wrap()
  }
  wrap() {
    return new Proxy(this, Character.attrHandler)
  }
  toJSON() {
    return `${this.id}: [Not implemented: query and return all character attributes]`
  }
  findToken() {
    var tokens = findObjs({
      _pageid: Campaign().get('playerpageid'),
      _type: 'graphic',
      represents: this.id,
    })

    return tokens[0]
  }
  distanceFromToken(targetToken) {
    if (typeof targetToken == 'string') {
      //if tokenId was passed in, insted of a token, resolve this
      targetToken = findObjs({
        _type: 'graphic',
        id: targetToken,
      })[0]
    }
    //TODO:this isn't right, see Atlas's cell....
    var token = this.findToken()
    var left = token.get('left') - targetToken.get('left')
    var top = token.get('top') - targetToken.get('top')
    var dist = Math.sqrt(left * left + top * top)

    var units = getObj('page', Campaign().get('playerpageid')).get('scale_number')

    dist = Math.floor((dist / 70) * Number(units))

    return dist
  }
  getRepeatingPrefixes() {
    let repeatingRows = new Set()
    findObjs({ characterid: this.id, type: 'attribute' }).forEach((i) => {
      var m = i.get('name').match(new RegExp(`repeating_([^_]*)_[^_]*_`))
      if (m != null && m[1]) {
        repeatingRows.add(m[1])
      }
    })
    return [...repeatingRows]
  }

  get character() {
    if (!this._character) this._character = getObj('character', this.id)
    return this._character
  }

  get name() {
    return this.character.get('name')
  }
  set name(val) {
    this.character.setWithWorker('name', val)
  }

  get avatar() {
    return this.character.get('avatar')
  }
  set avatar(val) {
    this.character.setWithWorker('avatar', val)
  }

  get archived() {
    return this.character.get('archived')
  }
  set archived(val) {
    this.character.setWithWorker('archived', val)
  }

  get inPlayerJournals() {
    return (this.character.get('inplayerjournals') || '').split(',')
  }
  set inPlayerJournals(val) {
    this.character.setWithWorker('inplayerjournals', val.join())
  }

  get controlledBy() {
    return (this.character.get('controlledby') || '').split(',')
  }
  set controlledBy(val) {
    this.character.setWithWorker('controlledby', val.join())
  }

  async getBio() {
    return new Promise((resolve) => this.character.get('bio', resolve))
  }
  setBio(bio) {
    this.character.setWithWorker('bio', bio)
  }

  async getGmNotes() {
    return new Promise((resolve) => this.character.get('gmnotes', resolve))
  }
  setGmNotes(gmNotes) {
    this.character.setWithWorker('gmnotes', gmNotes)
  }

  async getDefaultToken() {
    return new Promise((resolve) => this.character.get('_defaulttoken', resolve))
  }

  static attrHandler = {
    get: (obj, prop) => {
      switch (prop) {
        case 'repeating':
          if (obj.repeating == null) {
            obj.repeating = RepeatingSection.create(obj)
          }
          return obj.repeating
          break
      }
      try {
        return obj[prop] || getAttrByName(obj.id, prop)
      } catch {
        return ''
      }
    },
    set: (obj, prop, value) => {
      if (prop == 'repeating') {
        log('ERROR: the repeating property is reserved on the character object and cannot be created.')
        return
      }
      var json = `{"type":"attribute", "characterid":"${obj.id}", "name":"${prop}"}`
      var attrib = findObjs(JSON.parse(json))[0]
      if (attrib == null) {
        var obj = createObj('attribute', {
          name: prop,
          current: '',
          characterid: obj.id,
        })
        obj.setWithWorker({ current: value })
      } else {
        if (getAttrByName(obj.id, prop) == value) attrib.setWithWorker({ current: '' })
        attrib.setWithWorker({ current: value })
      }
      return true
    },
  }
}
