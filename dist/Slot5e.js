/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./SloUtils/ids.js
const randomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const generateUUID = function () {
  'use strict';

  var a = 0,
      b = [];
  return function () {
    var c = new Date().getTime() + 0,
        d = c === a;
    a = c;

    for (var e = new Array(8), f = 7; 0 <= f; f--) {
      e[f] = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(c % 64);
      c = Math.floor(c / 64);
    }

    c = e.join('');

    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) {
        b[f] = 0;
      }

      b[f]++;
    } else {
      for (f = 0; 12 > f; f++) {
        b[f] = Math.floor(64 * Math.random());
      }
    }

    for (f = 0; 12 > f; f++) {
      c += '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.charAt(b[f]);
    }

    return c;
  };
}();
const generateRowID = () => {
  'use strict';

  return generateUUID().replace(/_/g, 'Z');
};
// CONCATENATED MODULE: ./SloUtils/chat.js
const who = name => name.replace(/\(GM\)/, '').trim();
const whisper = (from, to, msg) => sendChat(from, `/w "${undefined.who(to)}" ${msg}`);
const sendChatAsync = (from, msg, opts) => new Promise((resolve, reject) => {
  try {
    sendChat(from, msg, results => resolve(results), opts);
  } catch (err) {
    reject(err);
  }
});
const roll = async rollFormula => {
  const [rollResultMsg] = await undefined.sendChatAsync('', `/r ${rollFormula}`);

  if (rollResultMsg.type !== 'rollresult') {
    throw new Error(`Roll failed: ${rollFormula}`);
  }

  const rollResult = JSON.parse(rollResultMsg.content);
  return rollResult.total;
};
const rollData = async rollFormula => {
  const [rollResultMsg] = await undefined.sendChatAsync('', `/r ${rollFormula}`);

  if (rollResultMsg.type !== 'rollresult') {
    throw new Error(`Roll failed: ${rollFormula}`);
  }

  const rollResult = JSON.parse(rollResultMsg.content);
  return rollResult;
};
// CONCATENATED MODULE: ./SloUtils/cache.js
/**
 * Creates a cache for easy access of a particular Roll20 object type.
 * ```js
 * const CC = objectCache("character")
 * const myCharId = "123456"
 * // Calls `getObj` the first time
 * const myChar = CC[myCharId]
 * // Does NOT call `getObj` on subsequent accesses
 * CC[myCharId].get("name")
 * ```
 * @param {"graphic" | "attribute" | "character" | "path" | "text" | "page" | "campaign" | "player" | "macro" | "rollabletable" | "tableitem" | "ability" | "handout" | "deck" | "card" | "hand" | "jukeboxtrack" | "custfx"} type
 */
const objectCache = type => {
  const cache = {};
  return new Proxy(cache, {
    get: (obj, objId) => {
      if (objId in obj) return obj[objId];
      let o = getObj(type, objId);
      if (o) obj[objId] = o;
      return o;
    }
  });
};
// CONCATENATED MODULE: ./SloUtils/commandParser.js

class commandParser_CommandParser {
  constructor(trigger, ...aliases) {
    this.trigger = trigger;
    this.aliases = aliases || [];
    this.defaultCmd;
    this.subCmds = {};
    this.buttonActions = {
      __ungrouped: {}
    };
  }

  default(action) {
    this.defaultCmd = {
      action
    };
    return this;
  }

  command(name, action) {
    this.subCmds[name] = {
      action
    };
    return this;
  }

  button({
    action,
    group = '__ungrouped'
  }) {
    if (!this.buttonActions[group]) {
      this.buttonActions[group] = {};
    }

    let id = randomId();
    this.buttonActions[group][id] = action;
    return `${this.trigger} _btn_${id}`;
  }

  async handleMessage(msg) {
    if (msg.type !== 'api') return;
    let content = msg.content.trim();
    let [trigger, subCommand, ...args] = content.split(' ');

    if (trigger !== this.trigger) {
      if (!this.aliases.length || !this.aliases.includes(trigger)) {
        return;
      }
    }

    if (subCommand && subCommand.startsWith('_btn_')) {
      let btnId = subCommand.replace('_btn_', '');

      for (const group in this.buttonActions) {
        if (btnId in this.buttonActions[group]) {
          let action = this.buttonActions[group][btnId];

          if (group !== '__ungrouped') {
            delete this.buttonActions[group];
          } else {
            delete group[btnId];
          }

          await action();
          return;
        }
      }

      throw new Error(`Hey, that button is expired!`);
    }

    if (!subCommand || subCommand.startsWith('--') || !(subCommand in this.subCmds)) {
      if (this.defaultCmd) {
        const opts = this.parseArgs([subCommand, ...args]);
        await this.defaultCmd.action(opts, msg);
      } else {
        this.showHelp();
      }
    } else {
      if (subCommand in this.subCmds) {
        const opts = this.parseArgs(args);
        await this.subCmds[subCommand].action(opts, msg);
        return;
      }

      this.showHelp();
    }
  }

  parseArgs(args) {
    let options = args.reduce((opts, arg) => {
      if (!arg) return opts;

      if (arg.startsWith('--')) {
        let [key, val] = arg.slice(2).split('=');
        return { ...opts,
          [key]: val === undefined ? true : val
        };
      }

      return { ...opts,
        _: [...opts._, arg]
      };
    }, {
      _: []
    });
    return options;
  }

  showHelp() {}

}
// CONCATENATED MODULE: ./SloUtils/scriptBase.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ScriptBase = ({
  name,
  version,
  stateKey = name,
  initialState = {}
}) => {
  var _temp;

  return _temp = class {
    get state() {
      if (!state[stateKey]) {
        state[stateKey] = initialState;
      }

      return state[stateKey];
    }

    constructor() {
      _defineProperty(this, "onMessage", async msg => {
        if (!this.parser) return;

        try {
          await this.parser.handleMessage(msg);
        } catch (err) {
          log(`${name} ERROR: ${err.message}`);
          sendChat(`${name} ERROR:`, `/w ${msg.who.replace(/\(GM\)/, '').trim()} ${err.message}`);
        }
      });

      this.version = version;
      this.name = name;
      on('chat:message', this.onMessage);
      on('ready', () => {
        log(`\n[====== ${name} v${version} ======]`);
      });
    }

    resetState(newState = initialState) {
      state[stateKey] = newState;
    }

  }, _temp;
};
// CONCATENATED MODULE: ./SloUtils/character.js
function character_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class RepeatingSection {
  static create(charObj) {
    return new Proxy({
      char: charObj
    }, RepeatingSection.repeatingSectionHandler);
  }

}

character_defineProperty(RepeatingSection, "repeatingSectionHandler", {
  get: (obj, prop) => {
    //char.repeating.<prop> ->
    var prefixes = [];
    var retval = []; //identify all the repeating elements of the specified type for this character, by identifying the prefix Roll20 uses

    findObjs({
      characterid: obj.char.id,
      type: 'attribute'
    }).forEach(i => {
      var m = i.get('name').match(new RegExp(`repeating_${prop}_[^_]*_`));
      if (m != null) prefixes.push(m[0]);
    });
    prefixes = [...new Set(prefixes)]; //make unique list of prefixes, since these will exist for each parameter
    //now construct our array of repeating objects of the specified type, by creating the Proxy with the repeatingObjHandler and passing in the prefix

    prefixes.forEach(prefix => {
      var charId = obj.char.id;
      var rowPrefix = prefix;
      retval.push(new Proxy({
        charId: obj.char.id,
        prefix: prefix,
        delRow: () => {
          findObjs({
            _characterid: charId,
            _type: 'attribute'
          }).forEach(i => {
            if (i.get('name').indexOf(rowPrefix) > -1) {
              log('removing:' + i.get('name'));
              i.remove();
            }
          });
        }
      }, RepeatingSection.repeatingRowHandler));
    }); //these are created locally so they will be promoted into the attached addRow method

    var charId = obj.char.id;
    var section = prop;

    retval.addRow = function (attribs) {
      var char = Character.fromId(charId);
      var newRowId = generateRowID();

      for (var prop in attribs) {
        var name = `repeating_${section}_${newRowId}_${prop}`;
        var obj = createObj('attribute', {
          characterid: charId,
          name: name,
          current: ''
        });
        obj.setWithWorker({
          current: attribs[prop]
        });
      }

      char.forceRecalc = Date.now(); //TODO: this is a workersheet item that does not below in the base class

      return newRowId; //perhaps search the character for this new item and return it?
    };

    return retval;
  },
  set: (obj, prop, value) => {
    return true;
  }
});

character_defineProperty(RepeatingSection, "repeatingRowHandler", {
  //expand the simple property passed in with the prefix and character id, and return the current value
  get: (obj, prop) => {
    if (prop == 'delRow') return obj.delRow;
    if (prop == 'prefix') return obj.prefix;
    if (prop == 'charId') return obj.charId;
    var retval = null;
    findObjs({
      _characterid: obj.charId,
      _type: 'attribute',
      _name: obj.prefix + prop
    }).forEach(i => {
      retval = i.get('current');
    }); //if(retval==null) log(`Warning: Unable to find property "${prop}" Returning NULL. `);

    return retval;
  },
  set: (obj, prop, value) => {
    findObjs({
      _characterid: obj.charId,
      _type: 'attribute',
      _name: obj.prefix + prop
    }).forEach(i => {
      i.setWithWorker({
        current: value
      });
    });
    return true;
  }
});

class Character {
  constructor(characterId, suppressWarning = false) {
    character_defineProperty(this, "id", null);

    character_defineProperty(this, "repeating", null);

    this.id = characterId;
    if (suppressWarning == false) log('WARNING! It is best practice to create Character objects using the factory pattern, to allow for game specific versions of characters.  As such, consider using: Character.fromId(charId); rather than: new Character(charId);');
  }

  static fromId(characterId) {
    var retval = new Character(characterId, true);
    return retval.wrap();
  }

  static fromToken(token) {
    var tokenId = token;
    if (typeof token == 'object') tokenId = token.id;
    var tokenObj = getObj('graphic', tokenId);
    if (tokenObj == null) return null;
    var retval = new Character(tokenObj.get('represents'), true);
    return retval.wrap();
  }

  wrap() {
    return new Proxy(this, Character.attrHandler);
  }

  toJSON() {
    return `${this.id}: [Not implemented: query and return all character attributes]`;
  }

  findToken() {
    var tokens = findObjs({
      _pageid: Campaign().get('playerpageid'),
      _type: 'graphic',
      represents: this.id
    });
    return tokens[0];
  }

  distanceFromToken(targetToken) {
    if (typeof targetToken == 'string') {
      //if tokenId was passed in, insted of a token, resolve this
      targetToken = findObjs({
        _type: 'graphic',
        id: targetToken
      })[0];
    } //TODO:this isn't right, see Atlas's cell....


    var token = this.findToken();
    var left = token.get('left') - targetToken.get('left');
    var top = token.get('top') - targetToken.get('top');
    var dist = Math.sqrt(left * left + top * top);
    var units = getObj('page', Campaign().get('playerpageid')).get('scale_number');
    dist = Math.floor(dist / 70 * Number(units));
    return dist;
  }

  getRepeatingPrefixes() {
    let repeatingRows = new Set();
    findObjs({
      characterid: this.id,
      type: 'attribute'
    }).forEach(i => {
      var m = i.get('name').match(new RegExp(`repeating_([^_]*)_[^_]*_`));

      if (m != null && m[1]) {
        repeatingRows.add(m[1]);
      }
    });
    return [...repeatingRows];
  }

}

character_defineProperty(Character, "attrHandler", {
  get: (obj, prop) => {
    switch (prop) {
      case 'repeating':
        if (obj.repeating == null) {
          obj.repeating = RepeatingSection.create(obj);
        }

        return obj.repeating;
        break;
    }

    try {
      return obj[prop] || getAttrByName(obj.id, prop);
    } catch {
      return '';
    }
  },
  set: (obj, prop, value) => {
    if (prop == 'repeating') {
      log('ERROR: the repeating property is reserved on the character object and cannot be created.');
      return;
    }

    var json = `{"type":"attribute", "characterid":"${obj.id}", "name":"${prop}"}`;
    var attrib = findObjs(JSON.parse(json))[0];

    if (attrib == null) {
      var obj = createObj('attribute', {
        name: prop,
        current: '',
        characterid: obj.id
      });
      obj.setWithWorker({
        current: value
      });
    } else {
      if (getAttrByName(obj.id, prop) == value) attrib.setWithWorker({
        current: ''
      });
      attrib.setWithWorker({
        current: value
      });
    }

    return true;
  }
});
// CONCATENATED MODULE: ./SloUtils/token.js
const StatusType = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'CUSTOM'
};
const removeStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = status;

  if (statusType === StatusType.CUSTOM) {
    // TODO: Remove hard dependency on libTokenMarkers
    tag = libTokenMarkers.getStatus(status).getTag();
  }

  let statuses = token.get('statusmarkers').split(',');
  let oldStatusLength = statuses.length;
  statuses = statuses.filter(s => s !== tag);
  token.set('statusmarkers', statuses.join());
  return statuses.length < oldStatusLength;
};
const addStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = status;

  if (statusType === StatusType.CUSTOM) {
    tag = libTokenMarkers.getStatus(status).getTag();
  }

  let statuses = token.get('statusmarkers').split(',');
  if (statuses.indexOf(tag) !== -1) return false;
  statuses.push(tag);
  token.set('statusmarkers', statuses.join());
  return true;
};
// CONCATENATED MODULE: ./SloUtils/index.js






 // export const getTokens = (ids) => (ids || []).map(({ _type, _id }) => getObj(_type, _id)).filter((o) => !!o)
// CONCATENATED MODULE: ./Slot5e/charResources.js


class Resource {
  constructor(side, nameAttr, valAttr) {
    this.side = side;
    this.nameAttr = nameAttr;
    this.valAttr = valAttr;
  }

  get name() {
    return this.nameAttr.get('current');
  }

  set name(n) {
    this.nameAttr.setWithWorker({
      current: n
    });
  }

  get curr() {
    return this.valAttr.get('current');
  }

  set curr(c) {
    this.valAttr.set({
      current: c
    });
  }

  get max() {
    return this.valAttr.get('max');
  }

  set max(m) {
    this.valAttr.set({
      max: m
    });
  }

}

class charResources_CharResources {
  constructor(id) {
    this.id = id;
    this.resourceAttrsByRow = {};
    this.rows = [];
    let resourceRegex = new RegExp('repeating_resource_([^_]*)_resource_(left|right)(_name)?');
    findObjs({
      characterid: id,
      type: 'attribute'
    }).forEach(attr => {
      var match = attr.get('name').match(resourceRegex);

      if (match) {
        const [name, row, side, isNameAttr] = match;

        if (!(row in this.resourceAttrsByRow)) {
          this.resourceAttrsByRow[row] = {};
        }

        if (!(side in this.resourceAttrsByRow[row])) {
          this.resourceAttrsByRow[row][side] = {};
        }

        if (isNameAttr) {
          this.resourceAttrsByRow[row][side].nameAttr = attr;
        } else {
          this.resourceAttrsByRow[row][side].valAttr = attr;
        }
      }
    });

    for (const rowId in this.resourceAttrsByRow) {
      const row = this.resourceAttrsByRow[rowId];
      let resVals = [];

      if (row.left && row.left.nameAttr && row.left.valAttr) {
        resVals.push(new Resource('left', row.left.nameAttr, row.left.valAttr));
      }

      if (row.right && row.right.nameAttr && row.right.valAttr) {
        resVals.push(new Resource('right', row.right.nameAttr, row.right.valAttr));
      }

      this.rows.push(resVals);
    }
  }

  addRow(left = null, right = null) {
    let rowId = generateRowID();

    const makeAttr = (suffix, curr, max) => {
      const attr = createObj('attribute', {
        characterid: this.id,
        name: `${prefix}${suffix}`,
        current: ''
      });
      if (curr) attr.setWithWorker({
        current: curr
      });
      if (max) attr.setWithWorker({
        max
      });
      return attr;
    };

    this.resourceAttrsByRow[rowId] = {};
    let prefix = `repeating_resource_${rowId}_resource_`;
    const leftNameAttr = makeAttr('left_name', left && left.name);
    const leftValAttr = makeAttr('left', left && left.curr, left && left.max);
    this.resourceAttrsByRow[rowId].left = {
      nameAttr: leftNameAttr,
      valAttr: leftValAttr
    };
    const leftRes = new Resource('left', leftNameAttr, leftValAttr);
    const rightNameAttr = makeAttr('right_name', right && right.name);
    const rightValAttr = makeAttr('right', right && right.curr, right && right.max);
    this.resourceAttrsByRow[rowId].right = {
      nameAttr: rightNameAttr,
      valAttr: rightValAttr
    };
    const rightRes = new Resource('right', rightNameAttr, rightValAttr);
    this.rows.push([leftRes, rightRes]);
    return [leftRes, rightRes];
  }

  getOrCreateByName(name) {
    for (const row of this.rows) {
      for (const res of row) {
        if (res.name.startsWith(name)) return res;
      }
    }

    const [left] = this.addRow({
      name
    });
    return left;
  }

}
// CONCATENATED MODULE: ./Slot5e/slotTracker.js


const SLOT_RESOURCE_NAME = 'Slots';

const buildStatusMessage = (title, body, color = '#000') => {
  return `<div style="background-color: #fff ; border: 1px solid ${color} ; padding: 5px ; border-radius: 5px ; overflow: hidden">` + `<div style="font-size: 14px ; font-weight: bold ; background-color: ${color}; padding: 3px ; border-top-left-radius: 3px ; border-top-right-radius: 3px">` + `<span style="color: white">` + `<div style="width: 1.7em ; vertical-align: middle ; height: 1.7em ; display: inline-block ; margin: 0 3px 0 0 ; border: 0 ; padding: 0 ; background-image: url(&quot;https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495&quot;) ; background-repeat: no-repeat ; background-size: auto 1.7em"></div>` + `${title}` + `</span>` + `</div>` + `${body}` + `</div>`;
};

const ENCUMBERED_MSG = name => buildStatusMessage(`${name} is Encumbered`, `<ul>` + `<li>Your speed is halved</li>` + `<li>You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution</li>` + `</ul>`, `#c27913`);

const OVERLOADED_MSG = name => buildStatusMessage(`${name} is Overloaded`, `You are carrying too much! You cannot do anything until you drop some items.`, `#c22513`);

const UNENCUMBERED_MSG = name => buildStatusMessage(`${name} is no longer Encumbered`, ``, `#13c24d`);

const parseItem = item => {
  const name = item.itemname; // item.itemproperties - The "Prop" field - ""
  // item.itemcontent
  // item.itemmodifiers = The "Mod" field - ""
  // item.hasattack - If the item has a corresponding attack - 0 | 1
  // item.useasresource - If the item has a corresponding resource - 0 | 1
  // item.itemattackid - The item's corresponding attack ID - ""
  // item.inventorysubflag - Whether the submenu is opened or closed - "0" | "1"
  // item.equipped - If the item is equipped or not - "0" | "1"
  // item.itemresourceid - The item's corresponding resource ID - ""

  let bulk = !!item.itemweight ? parseFloat(item.itemweight) : 0;
  if (isNaN(bulk)) bulk = 0;
  let count = !!item.itemcount ? parseInt(item.itemcount) : 1;
  if (isNaN(count)) count = 0;
  return {
    name,
    bulk,
    count
  };
};

class slotTracker_SlotTracker {
  constructor(char) {
    var _getObj;

    this.char = char;
    this.charName = (_getObj = getObj('character', char.id)) === null || _getObj === void 0 ? void 0 : _getObj.get('name');
    const resources = new charResources_CharResources(char.id);
    this.slotRes = resources.getOrCreateByName(SLOT_RESOURCE_NAME);
    if (this.slotRes.curr === '') this.slotRes.curr = '0';
    if (this.slotRes.max === '') this.slotRes.max = '0';
  }

  update() {
    let max = this.maxSlots();
    let bulk = this.totalItemBulk() + this.totalCoinBulk();
    this.slotRes.curr = bulk;
    this.slotRes.max = max;
    let name = SLOT_RESOURCE_NAME;

    if (bulk > Math.floor(max * 1.5)) {
      name += ' (OVERLOADED)';
      this.setOverloaded();
    } else if (bulk > max) {
      name += ' (ENCUMBERED)';
      this.setEncumbered();
    } else {
      this.setUnencumbered();
    }

    this.slotRes.name = name;
  }

  setOverloaded() {
    let token = this.char.findToken();
    if (!token) return;
    let changed = addStatus(token, 'Encumbered', StatusType.CUSTOM);
    changed = changed || token.get('tint_color') !== '#BB3333';
    token.set('tint_color', '#BB3333');

    if (changed) {
      sendChat('Slot5e', OVERLOADED_MSG(this.charName), null, {
        noarchive: true
      });
    }
  }

  setEncumbered() {
    let token = this.char.findToken();
    if (!token) return; // TODO: Make Encumbered marker configurable

    let changed = addStatus(token, 'Encumbered', StatusType.CUSTOM);
    changed = changed || token.get('tint_color') !== 'transparent';
    token.set('tint_color', 'transparent');

    if (changed) {
      sendChat('Slot5e', ENCUMBERED_MSG(this.charName), null, {
        noarchive: true
      });
    }
  }

  setUnencumbered() {
    let token = this.char.findToken();
    if (!token) return;
    let changed = removeStatus(token, 'Encumbered', StatusType.CUSTOM);
    token.set('tint_color', 'transparent');

    if (changed) {
      sendChat('Slot5e', UNENCUMBERED_MSG(this.charName), null, {
        noarchive: true
      });
    }
  }

  maxSlots() {
    let strMod = parseInt(this.char.strength_mod);
    let conMod = parseInt(this.char.constitution_mod);
    let mod = Math.max(strMod, conMod);
    if (isNaN(mod)) throw new Error(`Invalid str/con modifier for character ${this.char.id}`);
    return 18 + mod;
  }

  totalItemBulk() {
    let total = 0;

    for (const item of this.char.repeating.inventory) {
      if (item.equipped === '0') continue;
      const {
        name,
        bulk,
        count
      } = parseItem(item);
      total += bulk * count;
    }

    return total;
  }

  totalCoinBulk() {
    let coins = [this.char.cp, this.char.sp, this.char.ep, this.char.gp, this.char.pp];
    let numCoins = coins.reduce((sum, coin) => {
      let val = parseInt(coin);
      return isNaN(val) ? sum : sum + val;
    }, 0); // Take into account the 100 "free" coins

    numCoins = Math.max(0, numCoins - 100);
    let bulk = Math.ceil(numCoins / 100);
    return bulk;
  }

  toString() {
    return `Inventory Slots: ${this.slotRes.curr} / ${this.slotRes.max}`;
  }

}
// CONCATENATED MODULE: ./Slot5e/index.js
function Slot5e_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const invAttrRegex = new RegExp('^([csegp]p)|repeating_inventory_([^_]*)_(itemcount|itemweight|equipped)');

class Slot5e_Slot5e extends ScriptBase({
  name: 'Slot5e',
  version: '0.3.1',
  stateKey: 'SLOT_5E',
  initialState: {}
}) {
  constructor() {
    super();

    Slot5e_defineProperty(this, "log", msg => log(`${this.name}: ${msg}`));

    Slot5e_defineProperty(this, "onAddAttribute", attr => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    Slot5e_defineProperty(this, "onChangeAttribute", (attr, oldAttr) => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    Slot5e_defineProperty(this, "onDestroyAttribute", attr => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    Slot5e_defineProperty(this, "onAddCharacter", char => {
      this.log(`Adding tracker for ${char.get('name')}`);
      this.trackers[char.id] = new slotTracker_SlotTracker(Character.fromId(char.id));
      this.trackers[char.id].update();
    });

    Slot5e_defineProperty(this, "onDestroyCharacter", char => {
      this.log(`Removing tracker for ${char.get('name')}`);
      delete this.pcs[char.id];
    });

    this.trackers = {};
    on('ready', () => {
      on('add:attribute', this.onAddAttribute);
      on('change:attribute', this.onChangeAttribute);
      on('destroy:attribute', this.onDestroyAttribute);
      on('add:character', this.onAddCharacter);
      on('destroy:character', this.onDestroyCharacter);
      const chars = findObjs({
        _type: 'character',
        archived: false
      }).filter(char => String(getAttrByName(char.id, 'npc')) !== '1');

      for (const char of chars) {
        this.log(`Adding tracker for ${char.get('name')}`);
        this.trackers[char.id] = new slotTracker_SlotTracker(Character.fromId(char.id));
        this.trackers[char.id].update();
      }
    });
    this.parser = new CommandParser('!slot5e').default(() => {
      let names = [];

      for (const id in this.trackers) {
        this.trackers[id].update();
        names.push(this.trackers[id].charName);
      }

      sendChat(this.name, `Manually updated slots for ${names.join(', ')}`);
    });
  }

  getTrackerForId(id) {
    if (!(id in this.trackers)) {
      this.trackers[id] = new slotTracker_SlotTracker(Character.fromId(id));
    }

    return this.trackers[id];
  }

}

const Slot5e = new Slot5e_Slot5e();

/***/ })
/******/ ]);