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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SloUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // TODO: Move this into SloUtils

const multiCommand = (opts, msg, targetArg, action) => {
  let targets;

  if (opts[targetArg]) {
    targets = opts[targetArg].split(',').map(id => getObj('graphic', id));
  } else {
    targets = msg.selected.map(s => getObj('graphic', s._id));
  }

  targets = targets.filter(t => !!t);
  if (!targets.length) throw new Error(`Targets must be specified with a selection or with the --${targetArg} arg!`);
  targets.map(target => action(target));
};

class _SaltySeas extends Object(_SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* ScriptBase */ "c"])({
  name: 'SaltySeas',
  version: '0.0.1',
  stateKey: 'SALTY_SEAS',
  initialState: {}
}) {
  constructor() {
    super();

    _defineProperty(this, "log", msg => log(`${this.name}: ${msg}`));

    if (!CombatMaster) throw new Error('You must have CombatMaster installed for this script to work!');
    on('ready', () => {});
    this.parser = new CommandParser('!saltyseas').default(() => {
      sendChat(`Salty Seas campaign companion script v${this.version}`);
    }).command('addCondition', ({
      targetId,
      condition
    }, msg) => {
      if (!condition) throw new Error('Invalid args supplied for addCondition. Expected targetId and condition');
      multiCommand({
        targetId,
        condition
      }, msg, 'targetId', target => {
        CombatMaster.addConditionToToken(target, condition);
      });
    }).command('hasCondition', ({
      targetId,
      condition,
      custom
    }, msg) => {
      if (!condition) throw new Error('Invalid args supplied for hasCondition. Expected targetId and condition');
      const target = targetId ? getObj('graphic', targetId) : getObj('graphic', msg.selected[0]._id);
      const hasCondition = Object(_SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* hasStatus */ "i"])(target, condition, custom ? _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* StatusType */ "d"].CUSTOM : _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* StatusType */ "d"].DEFAULT);
      sendChat(this.name, hasCondition ? '1' : '0');
    }).command('thunderGauntlet', ({
      sourceId,
      targetId
    }) => {
      const source = getObj('graphic', sourceId);
      const target = getObj('graphic', targetId);
      CombatMaster.addConditionToToken(source, 'distracted');
      setTimeout(() => {
        CombatMaster.addTargetsToCondition([{
          _id: targetId
        }], sourceId, 'distracted');
      }, 600);
    }).command('hexbladeAttack', ({
      title,
      attackRoll,
      toHitBonus = '+0',
      baseDamage,
      critDamage,
      selectedId,
      targetId,
      sneak
    }, msg) => {
      const selected = _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* Character */ "a"].fromToken(selectedId);
      const target = _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* Character */ "a"].fromToken(targetId);
      const targetToken = getObj('graphic', targetId);
      const isCursed = Object(_SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* hasStatus */ "i"])(targetToken, 'HexbladesCurse', _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* StatusType */ "d"].CUSTOM);
      const isHexed = Object(_SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* hasStatus */ "i"])(targetToken, 'Hex', _SloUtils__WEBPACK_IMPORTED_MODULE_0__[/* StatusType */ "d"].CUSTOM);
      const cursedBonus = isCursed ? `+ ${selected.pb} [Curse] ` : '';
      const hexedBonus = isHexed ? `+ 1d6 [Hex] ` : '';
      const critHexedBonus = isHexed ? `+ 2d6 [Hex] ` : '';
      const healAmount = Math.max(parseInt(selected.multiclass1_lvl) + parseInt(selected.charisma_mod), 1);
      const sneakBonus = sneak ? `+ ${Math.ceil(selected.base_level / 2)}d6 [Sneak] ` : '';
      const critSneakBonus = sneak ? `+ ${Math.ceil(selected.base_level / 2) * 2}d6 [Sneak] ` : '';
      sendChat(msg.who, `!power {{ 
  --name|${title}
  --Attack Roll|You roll [[ [$atk] ${attackRoll}${toHitBonus} + ${selected.dexterity_mod} [DEX] + ${selected.pb} [Prof] ]]
  --?? ${isCursed ? '1' : '0'} == 1 ?? Curse|The target is cursed!
  --?? ${isHexed ? '1' : '0'} == 1 ?? Hex|The target is hexed!
  --?? $atk.base == 20 ?? skipto*1|Critical
  --?? $atk.base == 19 AND ${isCursed ? '1' : '0'} == 1 ?? skipto*2|Critical
  --?? $atk.base == 1 ?? skipto*3|Fumble
  --?? $atk.total >= ${target.npc_ac} ?? skipto*4|Hit
  
  --:Miss| Since we didn't skip to anywhere else, assume a miss
  --Miss|Your attack missed.
  --skipto*5|EndOfCard

  --:Fumble|
  --Natural 1|You miss horribly!
  --skipto*6|EndOfCard

  --:Hit|
  --Hit!|Your ${sneak ? 'sneak ' : ''}attack hit for [[ [$Dmg] ${baseDamage} + ${selected.dexterity_mod}${cursedBonus}${hexedBonus}${sneakBonus} ]] damage!
  --skipto*7|EndOfCard

  --:Critical|
  --Critical Hit|You strike a decisive blow for [[ [$CritDmg] ${critDamage} + ${selected.dexterity_mod}${cursedBonus}${critHexedBonus}${critSneakBonus} ]] damage!

  --:EndOfCard|
}}`);
      if (isCursed) sendChat(this.name, `If the target dies, heal for ${healAmount}`);
    }).command('test', ({}, msg) => {
      sendChat(this.name, `!power {{
          --name|Hexblade's Curse
          --leftsub|Debuff
          --rightsub|Range 30 ft.
          --?? 1 == 1 ?? api_saltyseas|addCondition _targetId=@{target|token_id} _condition=hexbladecurse
          }}`);
    });
  }

}

const SaltySeas = new _SaltySeas();

/***/ })
/******/ ]);