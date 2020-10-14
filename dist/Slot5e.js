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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "m", function() { return /* reexport */ randomId; });
__webpack_require__.d(__webpack_exports__, "g", function() { return /* reexport */ generateRowID; });
__webpack_require__.d(__webpack_exports__, "o", function() { return /* reexport */ who; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ commandParser_CommandParser; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* reexport */ ScriptBase; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ Character; });
__webpack_require__.d(__webpack_exports__, "h", function() { return /* reexport */ getCharactersForPlayer; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* reexport */ StatusType; });
__webpack_require__.d(__webpack_exports__, "n", function() { return /* reexport */ removeStatus; });
__webpack_require__.d(__webpack_exports__, "i", function() { return /* reexport */ hasStatus; });
__webpack_require__.d(__webpack_exports__, "e", function() { return /* reexport */ addStatus; });
__webpack_require__.d(__webpack_exports__, "f", function() { return /* reexport */ h_elements; });
__webpack_require__.d(__webpack_exports__, "j", function() { return /* reexport */ iconHeader; });
__webpack_require__.d(__webpack_exports__, "l", function() { return /* reexport */ menuWithHeader; });
__webpack_require__.d(__webpack_exports__, "k", function() { return /* reexport */ listMenu; });

// UNUSED EXPORTS: generateUUID, whisper, sendChatAsync, roll, rollData, objectCache, h, kebabCase

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
    log(`Handling message ${trigger} ~ ${subCommand} ~ ${JSON.stringify(args)}`);

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

          const opts = this.parseArgs(args);
          await action(opts, msg);
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
      const rowId = prefix.match(new RegExp(`repeating_[^_]*_([^_]*)_`))[1];
      retval.push(new Proxy({
        charId: obj.char.id,
        prefix: prefix,
        rowId,
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
    if (prop == 'rowId') return obj.rowId;
    var retval = null;
    let subprop = 'current';

    if (prop.startsWith('MAX_')) {
      subprop = 'max';
      prop = prop.slice(4);
    }

    findObjs({
      _characterid: obj.charId,
      _type: 'attribute',
      _name: obj.prefix + prop
    }).forEach(i => {
      retval = i.get(subprop);
    }); //if(retval==null) log(`Warning: Unable to find property "${prop}" Returning NULL. `);

    return retval;
  },
  set: (obj, prop, value) => {
    let subprop = 'current';

    if (prop.startsWith('MAX_')) {
      subprop = 'max';
      prop = prop.slice(4);
    }

    findObjs({
      _characterid: obj.charId,
      _type: 'attribute',
      _name: obj.prefix + prop
    }).forEach(i => {
      i.setWithWorker({
        [subprop]: value
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

  get character() {
    if (!this._character) this._character = getObj('character', this.id);
    return this._character;
  }

  get name() {
    return this.character.get('name');
  }

  set name(val) {
    this.character.setWithWorker('name', val);
  }

  get avatar() {
    return this.character.get('avatar');
  }

  set avatar(val) {
    this.character.setWithWorker('avatar', val);
  }

  get archived() {
    return this.character.get('archived');
  }

  set archived(val) {
    this.character.setWithWorker('archived', val);
  }

  get inPlayerJournals() {
    return (this.character.get('inplayerjournals') || '').split(',');
  }

  set inPlayerJournals(val) {
    this.character.setWithWorker('inplayerjournals', val.join());
  }

  get controlledBy() {
    return (this.character.get('controlledby') || '').split(',');
  }

  set controlledBy(val) {
    this.character.setWithWorker('controlledby', val.join());
  }

  async getBio() {
    return new Promise(resolve => this.character.get('bio', resolve));
  }

  setBio(bio) {
    this.character.setWithWorker('bio', bio);
  }

  async getGmNotes() {
    return new Promise(resolve => this.character.get('gmnotes', resolve));
  }

  setGmNotes(gmNotes) {
    this.character.setWithWorker('gmnotes', gmNotes);
  }

  async getDefaultToken() {
    return new Promise(resolve => this.character.get('_defaulttoken', resolve));
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

const getCharactersForPlayer = playerId => {
  return findObjs({
    type: 'character'
  }).filter(char => {
    let isPC = String(getAttrByName(char.id, 'npc')) !== '1';
    return isPC && char.get('controlledby').split(',').some(c => c === 'all' || c === playerId);
  });
};
// CONCATENATED MODULE: ./SloUtils/token.js
const StatusType = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'CUSTOM'
};

const getTag = (status, statusType) => statusType === StatusType.DEFAULT ? status : libTokenMarkers.getStatus(status).getTag();

const removeStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType);
  let statuses = token.get('statusmarkers').split(',');
  let oldStatusLength = statuses.length;
  statuses = statuses.filter(s => s !== tag);
  token.set('statusmarkers', statuses.join());
  return statuses.length < oldStatusLength;
};
const hasStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType);
  let statuses = token.get('statusmarkers').split(',');
  return statuses.indexOf(tag) !== -1;
};
const addStatus = (token, status, statusType = StatusType.DEFAULT) => {
  let tag = getTag(status, statusType);
  let statuses = token.get('statusmarkers').split(',');
  if (statuses.indexOf(tag) !== -1) return false;
  statuses.push(tag);
  token.set('statusmarkers', statuses.join());
  return true;
};
// CONCATENATED MODULE: ./SloUtils/string.js
const kebabCase = string => string.replace(/([A-Z])([A-Z])/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
// CONCATENATED MODULE: ./SloUtils/h.js


const renderStyle = style => {
  if (typeof style === 'string') return style;
  let res = '';

  for (const key in style) {
    let val = style[key];

    if (typeof val === 'number') {
      val = `${val}px`;
    }

    res += `${kebabCase(key)}:${val};`;
  }

  return `"${res}"`;
};

const h = (tag, attrsOrChild, ...children) => {
  try {
    let attrs = {};

    if (!!attrsOrChild) {
      if (typeof attrsOrChild === 'object' && !Array.isArray(attrsOrChild)) {
        attrs = attrsOrChild;
      } else {
        children.unshift(attrsOrChild);
      }
    }

    const renderArr = arr => {
      let res = '';

      for (const el of arr) {
        if (typeof el === 'string' || typeof el === 'number') {
          res += el;
        } else if (Array.isArray(el)) {
          res += renderArr(el);
        }
      }

      return res;
    };

    let attrStr = '';

    for (const attrKey in attrs) {
      if (attrKey === 'style') {
        attrStr += `style=${renderStyle(attrs.style)} `;
      } else {
        attrStr += `${kebabCase(attrKey)}="${attrs[attrKey]}" `;
      }
    }

    const childrenStr = renderArr(children);
    return `<${tag} ${attrStr}>${childrenStr}</${tag}>`;
  } catch (error) {
    return `ERROR ${error.message}`;
  }
};

const makeEl = tag => (...children) => h(tag, ...children);

const h_elements = {
  div: makeEl('div'),
  a: makeEl('a'),
  p: makeEl('p'),
  ul: makeEl('ul'),
  ol: makeEl('ol'),
  li: makeEl('li'),
  span: makeEl('span'),
  img: makeEl('img'),
  hr: makeEl('hr'),
  pre: makeEl('pre'),
  br: makeEl('br'),
  b: makeEl('b'),
  table: makeEl('table'),
  tr: makeEl('tr'),
  td: makeEl('td'),
  th: makeEl('th'),
  h1: makeEl('h1'),
  h2: makeEl('h2'),
  h3: makeEl('h3'),
  h4: makeEl('h4'),
  h5: makeEl('h5'),
  h6: makeEl('h6')
};
// CONCATENATED MODULE: ./SloUtils/menu.js

const {
  div,
  span,
  ul,
  li
} = h_elements;
const iconHeader = (title, url) => {
  return div({
    style: {
      width: '1.7em',
      verticalAlign: 'middle',
      height: '1.7em',
      display: 'inline-block',
      margin: '0 3px 0 0',
      border: 0,
      padding: 0,
      backgroundImage: `url(&quot;${url}&quot;)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 1.7em'
    }
  }) + title;
};
const menuWithHeader = (title, body, color = '#000') => {
  return div({
    style: {
      backgroundColor: 'white',
      border: `1px solid ${color}`,
      padding: 5,
      borderRadius: 5,
      overflow: 'hidden'
    }
  }, div({
    style: {
      fontSize: 14,
      fontWeight: 'bold',
      backgroundColor: color,
      padding: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3
    }
  }, span({
    style: {
      color: 'white'
    }
  }, title)), body);
};
const listMenu = ({
  title,
  color = '#000',
  data,
  renderItem
}) => {
  return menuWithHeader(title, ul({
    style: 'padding:0;margin:0;list-style:none;'
  }, ...data.map((item, index) => {
    return li(renderItem(item, index));
  })), color);
};
// CONCATENATED MODULE: ./SloUtils/index.js









 // export const getTokens = (ids) => (ids || []).map(({ _type, _id }) => getObj(_type, _id)).filter((o) => !!o)

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./SloUtils/index.js + 10 modules
var SloUtils = __webpack_require__(0);

// CONCATENATED MODULE: ./Slot5e/ui.js

const {
  span,
  div,
  a,
  b,
  ul,
  li
} = SloUtils["f" /* elements */];
const ui_link = (text, href) => {
  return a({
    href,
    style: {
      backgroundColor: 'transparent',
      color: 'black',
      padding: 0,
      display: 'initial',
      border: 'none',
      textDecoration: 'underline'
    }
  }, text);
};
const iconButton = (icon, title, link) => {
  return div({
    style: {
      display: 'inline-block',
      marginRight: 3,
      padding: 1,
      verticalAlign: 'middle'
    }
  }, a({
    href: link,
    title,
    style: {
      margin: 0,
      padding: 0,
      border: 'none',
      backgroundColor: 'transparent'
    }
  }, span({
    style: {
      color: 'black',
      padding: 0,
      fontSize: 12,
      fontFamily: `&quot;pictos&quot;`
    }
  }, icon)));
};
const itemListRow = ({
  index,
  text,
  actions
}) => {
  return div({
    style: {
      backgroundColor: index % 2 === 0 ? 'white' : 'lightgrey',
      width: '100%',
      paddingLeft: 4
    }
  }, span({
    style: {
      maxWidth: '85%',
      width: '100%',
      display: 'inline-block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  }, text), span(actions.map(({
    icon,
    label,
    action
  }) => iconButton(icon, label, action))));
};
// CONCATENATED MODULE: ./Slot5e/inventory.js


const {
  ul: inventory_ul,
  li: inventory_li,
  b: inventory_b
} = SloUtils["f" /* elements */];
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

const fromInvItem = invItem => {
  /** @type Item */
  let item = {
    id: invItem.rowId
  };
  item.name = invItem.itemname || 'Unnamed Item';
  item.bulk = parseFloat(invItem.itemweight);
  if (isNaN(item.bulk)) item.bulk = 0;
  item.count = parseInt(invItem.itemcount);
  if (isNaN(item.count)) item.count = 1;
  item.desc = invItem.itemdesc;
  return item;
};
/**
 * @param {string} itemId
 * @param {string} charId
 * @returns {Item?}
 */


const getItemFromInventory = (itemId, charId) => {
  let reg = new RegExp(`repeating_inventory_${itemId}_([^_]*)`);
  let rawItem = {
    rowId: itemId
  };
  findObjs({
    characterid: charId,
    type: 'attribute'
  }).forEach(attr => {
    let match = attr.get('name').match(reg);

    if (match && match[1]) {
      rawItem[match[1]] = attr.get('current');
    }
  });

  if (Object.keys(rawItem).length === 1) {
    throw new Error(`Unable to find item ${itemId} for character ${charId}!`);
  }
  /** @type Item */


  return { ...fromInvItem(rawItem),
    location: charId
  };
};
/**
 * Adds item to inventory. If the character has an item with matching
 * name, bulk, and desc, it will update the quantity instead.
 * @param {Item} item
 * @param {number} count
 * @param {string} charId
 * @returns {Item} The inventory item created on the character
 */

const pickupItem = (item, count, charId) => {
  const character = SloUtils["a" /* Character */].fromId(charId);

  for (const invItem of character.repeating.inventory) {
    const name = invItem.itemname;
    let bulk = parseFloat(invItem.itemweight);
    if (isNaN(bulk)) bulk = 0;
    let desc = invItem.itemdesc;

    if (name === item.name && bulk === item.bulk && desc === item.desc) {
      invItem.itemcount += count;
      return { ...fromInvItem(invItem),
        location: charId
      };
    }
  }

  let invItem = {
    itemname: item.name,
    itemcount: count,
    itemweight: item.bulk,
    itemdesc: item.desc
  };
  const newItemId = character.repeating.inventory.addRow(invItem);
  return { ...fromInvItem({ ...invItem,
      rowId: newItemId
    }),
    location: charId
  };
};
/**
 * Removes an item from an inventory. If the inventory has more
 * items than `count`, decrements the quantity instead.
 * @param {string} itemId
 * @param {number} count
 * @param {string} charId
 * @returns {Item} The ground item dropped
 */

const dropItem = (itemId, count, charId) => {
  const character = SloUtils["a" /* Character */].fromId(charId);

  for (const invItem of character.repeating.inventory) {
    if (invItem.rowId === itemId) {
      const groundItem = fromInvItem(invItem);
      let invItemCount = groundItem.count;

      if (count >= invItemCount) {
        invItem.delRow();
      } else {
        invItem.itemcount = invItemCount - count;
      }

      groundItem.id = Object(SloUtils["m" /* randomId */])();
      groundItem.count = count;
      groundItem.location = 'ground';
      return groundItem;
    }
  }
};
/**
 * @param {Item} item
 * @param {{ title: string, href: string }[]} actions
 * @returns {string}
 */

const showItemCard = (item, actions) => {
  let striped = false;

  const row = (key, ...vals) => {
    let renderedRow = inventory_li({
      style: {
        backgroundColor: striped ? 'lightgrey' : 'white'
      }
    }, inventory_b(`${key}: `), ...vals);
    striped = !striped;
    return renderedRow;
  };

  return Object(SloUtils["l" /* menuWithHeader */])(item.name, inventory_ul({
    style: 'padding:0;margin:0;list-style:none;'
  }, row('Quantity', item.count), row('Bulk', item.bulk), item.location === 'ground' ? null : row('Holder', ui_link(getObj('character', item.location).get('name'), `!slot5e listInventory --charId=${item.location}`)), item.desc ? row('Description', item.desc) : null, actions ? row('Actions', ...actions.map(({
    title,
    href
  }) => ui_link(title, href))) : null));
};
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
    let rowId = Object(SloUtils["g" /* generateRowID */])();

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


const {
  div: slotTracker_div,
  span: slotTracker_span,
  ul: slotTracker_ul,
  li: slotTracker_li
} = SloUtils["f" /* elements */];
const SLOT_RESOURCE_NAME = 'Slots';

const ENCUMBERED_MSG = name => Object(SloUtils["l" /* menuWithHeader */])(Object(SloUtils["j" /* iconHeader */])(`${name} is Encumbered`, 'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'), slotTracker_ul(slotTracker_li(`Your speed is halved`), slotTracker_li(`You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution`)), `#c27913`);

const OVERLOADED_MSG = name => Object(SloUtils["l" /* menuWithHeader */])(Object(SloUtils["j" /* iconHeader */])(`${name} is Overloaded`, 'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'), `You are carrying too much! You cannot do anything until you drop some items.`, `#c22513`);

const UNENCUMBERED_MSG = name => Object(SloUtils["l" /* menuWithHeader */])(Object(SloUtils["j" /* iconHeader */])(`${name} is no longer Encumbered`, 'https://s3.amazonaws.com/files.d20.io/images/2921607/-PQhRv3fWeAk7PLSUwYRQw/icon.png?1602013495'), ``, `#13c24d`);

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
    this.resources = new charResources_CharResources(char.id);
    this.slotRes = this.resources.getOrCreateByName(SLOT_RESOURCE_NAME);
    if (this.slotRes.curr === '') this.slotRes.curr = '0';
    if (this.slotRes.max === '') this.slotRes.max = '0';
  }

  get isContainer() {
    return this.char.size === 'Container';
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
    let changed = Object(SloUtils["e" /* addStatus */])(token, 'Encumbered', SloUtils["d" /* StatusType */].CUSTOM);
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
    if (!token) return;
    CombatMaster.addConditionToToken(token, 'encumbered'); // TODO: Make Encumbered marker configurable

    let changed = Object(SloUtils["e" /* addStatus */])(token, 'Encumbered', SloUtils["d" /* StatusType */].CUSTOM);
    changed = changed || token.get('tint_color') !== 'transparent';
    token.set('tint_color', 'transparent');

    if (changed) {
      let msg = ENCUMBERED_MSG(this.charName);
      log(msg);
      sendChat('Slot5e', msg, null, {
        noarchive: true
      });
    }
  }

  setUnencumbered() {
    let token = this.char.findToken();
    if (!token) return;
    let changed = Object(SloUtils["n" /* removeStatus */])(token, 'Encumbered', SloUtils["d" /* StatusType */].CUSTOM);
    token.set('tint_color', 'transparent');

    if (changed) {
      sendChat('Slot5e', UNENCUMBERED_MSG(this.charName), null, {
        noarchive: true
      });
    }
  }

  maxSlots() {
    if (this.isContainer) {
      return parseInt(this.char.class_resource);
    }

    let size = (this.char.size || 'Medium').toLowerCase();
    let strMod = parseInt(this.char.strength_mod);
    let conMod = parseInt(this.char.constitution_mod);
    let mod = Math.max(strMod, conMod);
    if (isNaN(mod)) throw new Error(`Invalid str/con modifier for character ${this.char.id}`);

    switch (size) {
      case 'tiny':
        return 6 + mod;

      case 'small':
        return 14 + mod;

      case 'medium':
        return 18 + mod;

      case 'large':
        return 22 + mod * 2;

      case 'huge':
        return 30 + mod * 4;

      case 'gargantuan':
        return 46 + mod * 8;
    }

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
    }, 0);

    if (!this.isContainer) {
      // Take into account the 100 "free" coins
      numCoins = Math.max(0, numCoins - 100);
    }

    let bulk = Math.ceil(numCoins / 100);
    return bulk;
  }

  toString() {
    return `Inventory Slots: ${this.slotRes.curr} / ${this.slotRes.max}`;
  }

}
// CONCATENATED MODULE: ./Slot5e/index.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const {
  span: Slot5e_span,
  div: Slot5e_div,
  a: Slot5e_a,
  b: Slot5e_b,
  ul: Slot5e_ul,
  li: Slot5e_li
} = SloUtils["f" /* elements */];
const invAttrRegex = new RegExp('^([csegp]p)|repeating_inventory_([^_]*)_(itemcount|itemweight|equipped)');

class Slot5e_Slot5e extends Object(SloUtils["c" /* ScriptBase */])({
  name: 'Slot5e',
  version: '0.3.1',
  stateKey: 'SLOT_5E',
  initialState: {
    groundItems: {}
  }
}) {
  constructor() {
    super();

    _defineProperty(this, "log", msg => log(`${this.name}: ${msg}`));

    _defineProperty(this, "listInventory", ({
      charId
    }, msg) => {
      let char = charId ? getObj('character', charId) : this._rerunWithChar(msg, `View Inventory`);
      if (!char) return;
      let character = SloUtils["a" /* Character */].fromId(char.id);
      sendChat(this.name, `/w "${Object(SloUtils["o" /* who */])(msg.who)}" ${Object(SloUtils["k" /* listMenu */])({
        title: char.get('name'),
        data: character.repeating.inventory,
        renderItem: (invItem, index) => {
          const item = getItemFromInventory(invItem.rowId, charId);
          const actions = [{
            icon: 'E',
            label: 'View Item',
            action: `!slot5e showInventoryItem --charId=${char.id} --itemId=${item.id}`
          }, {
            icon: 'R',
            label: 'Drop Item',
            action: this.getDropCommand(item, charId)
          }];
          return itemListRow({
            index,
            text: item.name,
            actions
          });
        }
      })}`);
    });

    _defineProperty(this, "pickupItem", ({
      itemId,
      count,
      charId
    }, msg) => {
      const item = this.state.groundItems[itemId];

      if (!item) {
        throw new Error(`This item has already been picked up!`);
      }

      let char = charId ? getObj('character', charId) : this._rerunWithChar(msg, `Pick up ${item.name}`);
      if (!char) return;
      if (count === 'all') count = parseInt(item.count);else count = parseInt(count);
      if (isNaN(count) || count < 1) count = 1;
      if (count > item.count) count = item.count;
      pickupItem(item, count, charId);
      let originalCount = item.count;

      if (count === item.count) {
        delete this.state.groundItems[itemId];
        item.count = 0;
      } else {
        item.count -= count;
      }

      if (originalCount === 1) {
        sendChat(this.name, `${char.get('name')} picked up ${item.name}`);
      } else {
        sendChat(this.name, `${char.get('name')} picked up ${count} x ${item.name}`);
      }

      if (item.count) {
        this.showGroundItem(item);
      }
    });

    _defineProperty(this, "dropItem", ({
      charId,
      itemId,
      count
    }) => {
      const item = getItemFromInventory(itemId, charId);
      if (count === 'all') count = parseInt(item.count);else count = parseInt(count);
      if (isNaN(count) || count < 1) count = 1;
      const groundItem = dropItem(itemId, count, charId);
      this.state.groundItems[groundItem.id] = groundItem;
      const charName = getObj('character', charId).get('name');
      sendChat(this.name, `${charName} dropped:`);
      this.showGroundItem(groundItem);
    });

    _defineProperty(this, "showInventoryItem", ({
      itemId,
      charId
    }, msg) => {
      let item = getItemFromInventory(itemId, charId);
      sendChat(this.name, `/w ${Object(SloUtils["o" /* who */])(msg.who)} ${showItemCard(item, [{
        title: 'Drop',
        href: this.getDropCommand(item, charId)
      }])}`);
    });

    _defineProperty(this, "showGroundItem", item => {
      sendChat(this.name, showItemCard(item, [{
        title: 'Pick Up',
        href: this.getPickupCommand(item)
      }]));
    });

    _defineProperty(this, "_rerunWithChar", (msg, title) => {
      let allChars = Object(SloUtils["h" /* getCharactersForPlayer */])(msg.playerid);

      if (allChars.length === 0) {
        throw new Error(`No characters found for ${msg.who}`);
      }

      if (allChars.length > 1) {
        sendChat(this.name, `/w "${Object(SloUtils["o" /* who */])(msg.who)}" ${Object(SloUtils["l" /* menuWithHeader */])(title, Slot5e_span(Slot5e_b('Pick: '), allChars.map(c => ui_link(c.get('name'), `${msg.content} --charId=${c.id}`))))}`);
        return null;
      }

      return allChars[0];
    });

    _defineProperty(this, "getDropCommand", (item, charId) => {
      return `!slot5e dropItem --charId=${charId} --itemId=${item.id} --count=${item.count === 1 ? '1' : `?{Drop how many? Enter a number or &quot;all&quot; (max: ${item.count})|all}`}`;
    });

    _defineProperty(this, "getPickupCommand", item => {
      return `!slot5e pickupItem --itemId=${item.id} --count=${item.count === 1 ? '1' : `?{Pick up how many? Enter a number or &quot;all&quot; (max: ${item.count})|all}`}`;
    });

    _defineProperty(this, "onAddAttribute", attr => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    _defineProperty(this, "onChangeAttribute", (attr, oldAttr) => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    _defineProperty(this, "onDestroyAttribute", attr => {
      if (attr.get('name').match(invAttrRegex)) {
        this.getTrackerForId(attr.get('_characterid')).update();
      }
    });

    _defineProperty(this, "onAddCharacter", char => {
      this.log(`Adding tracker for ${char.get('name')}`);
      this.trackers[char.id] = new slotTracker_SlotTracker(SloUtils["a" /* Character */].fromId(char.id));
      this.trackers[char.id].update();
    });

    _defineProperty(this, "onDestroyCharacter", char => {
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
        this.trackers[char.id] = new slotTracker_SlotTracker(SloUtils["a" /* Character */].fromId(char.id));
        this.trackers[char.id].update();
      }
    });
    this.parser = new SloUtils["b" /* CommandParser */]('!slot5e').default(() => {
      let names = [];

      for (const id in this.trackers) {
        this.trackers[id].update();
        names.push(this.trackers[id].charName);
      }

      sendChat(this.name, `Manually updated slots for ${names.join(', ')}`);
    }).command('container', (opts, msg) => {
      const name = opts._.join(' ') || 'Container';
      const containerChar = createObj('character', {
        name,
        inplayerjournals: 'all',
        controlledby: 'all'
      });
      const container = SloUtils["a" /* Character */].fromId(containerChar.id);
      container.size = 'Container';
      container.npc = '0';
      container.class_resource_name = 'Capacity';
      container.class_resource = opts.slots;
      container.mancer_cancel = 'on';
      sendChat(this.name, `Created container "${name}"`);
    }).command('listInventory', this.listInventory).command('pickupItem', this.pickupItem).command('dropItem', this.dropItem).command('showInventoryItem', this.showInventoryItem);
  }
  /**
   * CLI Command: Whispers a menu listing the specified container's inventory
   * Usage:
   * ```
   * !slot5e listInventory --charId=123
   * ```
   */


  /////////////////
  // EVENT HANDLERS
  /////////////////
  getTrackerForId(id) {
    if (!(id in this.trackers)) {
      this.trackers[id] = new slotTracker_SlotTracker(SloUtils["a" /* Character */].fromId(id));
    }

    return this.trackers[id];
  }

}

const Slot5e = new Slot5e_Slot5e();

/***/ })
/******/ ]);