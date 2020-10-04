/**
 * SLO_UTILS
 * Copied from SloUtils.js
 */
class _Slo {
  version = '0.2.1';

  randomId = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  who = (name) => name.replace(/\(GM\)/, '').trim();

  whisper = (from, to, msg) => sendChat(from, `/w "${this.who(to)}" ${msg}`);

  sendChatAsync = (from, msg, opts) =>
    new Promise((resolve, reject) => {
      try {
        sendChat(from, msg, (results) => resolve(results), opts);
      } catch (err) {
        reject(err);
      }
    });

  roll = async (rollFormula) => {
    const [rollResultMsg] = await this.sendChatAsync('', `/r ${rollFormula}`);
    if (rollResultMsg.type !== 'rollresult') {
      throw new Error(`Roll failed: ${rollFormula}`);
    }
    const rollResult = JSON.parse(rollResultMsg.content);
    return rollResult.total;
  };

  rollData = async (rollFormula) => {
    const [rollResultMsg] = await this.sendChatAsync('', `/r ${rollFormula}`);
    if (rollResultMsg.type !== 'rollresult') {
      throw new Error(`Roll failed: ${rollFormula}`);
    }
    const rollResult = JSON.parse(rollResultMsg.content);
    return rollResult;
  };

  getTokens = (ids) =>
    (ids || []).map(({ _type, _id }) => getObj(_type, _id)).filter((o) => !!o);
}
const Slo = new _Slo();

const _tcache = {};
const TC = new Proxy(_tcache, {
  get: (obj, tokenId) => {
    if (tokenId in obj) return obj[tokenId];

    let token = getObj('graphic', tokenId);
    if (token) {
      obj[tokenId] = token;
    }
    return token;
  },
});

const _ccache = {};
const CC = new Proxy(_ccache, {
  get: (obj, characterId) => {
    if (characterId in obj) return obj[characterId];

    let character = getObj('character', characterId);
    if (character) {
      obj[characterId] = character;
    }
    return character;
  },
});

class CommandParser {
  constructor(trigger, ...aliases) {
    this.trigger = trigger;
    this.aliases = aliases || [];
    this.defaultCmd;
    this.subCmds = {};
    this.buttonActions = {
      __ungrouped: {},
    };
  }

  default(action) {
    this.defaultCmd = { action };
    return this;
  }

  command(name, action) {
    this.subCmds[name] = { action };
    return this;
  }

  button({ action, group = '__ungrouped' }) {
    if (!this.buttonActions[group]) {
      this.buttonActions[group] = {};
    }
    let id = Slo.randomId();
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

    if (
      !subCommand ||
      subCommand.startsWith('--') ||
      !(subCommand in this.subCmds)
    ) {
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
    let options = args.reduce(
      (opts, arg) => {
        if (!arg) return opts;
        if (arg.startsWith('--')) {
          let [key, val] = arg.slice(2).split('=');
          return { ...opts, [key]: val === undefined ? true : val };
        }
        return {
          ...opts,
          _: [...opts._, arg],
        };
      },
      { _: [] }
    );

    return options;
  }

  showHelp() {}
}

const ScriptBase = ({ name, version, stateKey = name, initialState = {} }) =>
  class {
    version = version;
    name = name;

    get state() {
      if (!state[stateKey]) {
        state[stateKey] = initialState;
      }
      return state[stateKey];
    }

    onMessage = async (msg) => {
      if (!this.parser) return;
      try {
        await this.parser.handleMessage(msg);
      } catch (err) {
        log(`${name} ERROR: ${err.message}`);
        sendChat(
          `${name} ERROR:`,
          `/w ${msg.who.replace(/\(GM\)/, '').trim()} ${err.message}`
        );
      }
    };

    constructor() {
      on('chat:message', this.onMessage);
      on('ready', () => {
        log(`\n[====== ${name} v${version} ======]`);
      });
    }

    resetState(newState = initialState) {
      state[stateKey] = newState;
    }
  };

/**
 * FRIEND_COMPUTER
 * Copied from FriendComputer.js
 */

const SKILLS = [
  'athletics',
  'guns',
  'melee',
  'throw',
  'bluff',
  'charm',
  'intimidate',
  'stealth',
  'science',
  'psychology',
  'bureaucracy',
  'alpha-complex',
  'operate',
  'engineer',
  'program',
  'demolitions',
];
const SKILLS_BY_STAT = [
  ['athletics', 'guns', 'melee', 'throw'],
  ['bluff', 'charm', 'intimidate', 'stealth'],
  ['science', 'psychology', 'bureaucracy', 'alpha-complex'],
  ['operate', 'engineer', 'program', 'demolitions'],
];
const STATS = ['violence', 'chutzpah', 'brains', 'mechanics'];

class Troubleshooter {
  constructor(id) {
    this.id = id;
    this.char = CC[id];
    if (!this.char) throw new Error(`Unable to find character ${id}`);
  }

  hasAttr = (attr) => {
    log(`Checking ${this.name} for attribute ${attr}`);
    let val = getAttrByName(this.id, attr);
    log(`Found value ${val} ||| ${typeof val}`);
    return val !== '' && val !== undefined;
  };

  getAttr = (attr) => {
    let val = getAttrByName(this.id, attr);
    if (val === '') {
      val = undefined;
    }
    return val;
  };

  setAttr = (attr, val) => {
    log(`Setting ${this.name}'s value for ${attr} to ${val}`);
    if (!this.hasAttr(attr)) {
      log('Does not have attribute!');
      createObj('attribute', {
        name: attr,
        current: val,
        _characterid: this.id,
      });
      return;
    }

    let [currAttribute] = findObjs({
      _type: 'attribute',
      _characterid: this.id,
      name: attr,
    });

    if (!currAttribute) {
      createObj('attribute', {
        name: attr,
        current: val,
        _characterid: this.id,
      });
      return;
    }

    log(`Found attribute ${JSON.stringify(currAttribute)}`);
    currAttribute.set({ current: val });
  };

  get name() {
    return this.char.get('name');
  }

  /**
   * CLONES
   */

  get cloneNumber() {
    let num = this.getAttr('clone-number');
    if (!num) this.setAttr('clone-number', 1);
    return parseInt(num || 1);
  }

  set cloneNumber(num) {
    this.setAttr('clone-number', num);
  }

  /**
   * Description
   */

  get description() {
    let desc = this.getAttr('description');
    return desc.split(', ');
  }

  set description(descArr) {
    this.setAttr('description', descArr.join(', '));
  }

  /**
   * Some bullshit for handling the weird multi-attribute values
   */
  __initMultiStat(name, max, onOrOff) {
    for (let i = 1; i <= max; i++) {
      this.setAttr(`${name}-${i}`, onOrOff ? 'on' : 0);
    }
  }

  __getMultiStat(name, max, onOrOff) {
    let levels = [];
    for (let i = 1; i <= max; i++) {
      levels.push(this.getAttr(`${name}-${i}`));
    }

    if (levels.some((level) => level === undefined)) {
      this.__initMultiStat(name, max, onOrOff);
      return onOrOff ? max : 0;
    }

    return levels.reduce(
      (count, level) => (level === 'on' ? count + 1 : count),
      0
    );
  }

  __setMultiStat(name, max, onOrOff, num) {
    for (let i = 1; i <= max; i++) {
      if (i <= num) {
        this.setAttr(`${name}-${i}`, 'on');
      } else {
        this.setAttr(`${name}-${i}`, 0);
      }
    }
  }

  /**
   * MOXIE
   */

  get moxie() {
    let max = this.getSkill('moxie-maximum');
    if (max === undefined) {
      this.setSkill('moxie-maximum', 8);
      max = 8;
    }

    let mox = this.__getMultiStat('moxie-level', 8, true);
    if (mox > max) {
      this.__setMultiStat('moxie-level', 8, true, max);
      return max;
    }
    return mox;
  }

  set moxie(num) {
    let max = this.getSkill('moxie-maximum');
    if (max === undefined) {
      this.setSkill('moxie-maximum', 8);
      max = 8;
    }

    if (num > max) {
      num = max;
    }

    this.__setMultiStat('moxie-level', 8, true, num);
  }

  /**
   * TREASON
   */

  get treason() {
    return this.__getMultiStat('treason-level', 5, false);
  }

  set treason(num) {
    this.__setMultiStat('treason-level', 5, false, num);
  }

  /**
   * WOUNDS
   */

  get wounds() {
    return this.__getMultiStat('wounds-level', 4, false);
  }

  set wounds(num) {
    this.__setMultiStat('wounds-level', 4, false, num);
  }

  takeDamage = (level) => {
    let currDamage = this.wounds;
    if (currDamage > level) return;
    this.wounds = level;
  };

  /**
   * SKILLS
   */

  hasSkill = (skill) => {
    return this.hasAttr(skill);
  };

  getSkill = (skill) => {
    let val = this.getAttr(skill);
    if (val !== undefined) val = parseInt(val);
    return val;
  };

  setSkill = (skill, val) => {
    this.setAttr(skill, val);
  };

  getStatVals = () => {
    return SKILLS_BY_STAT.map((skillsForStat) => {
      let valsForStat = skillsForStat.map((skill) => this.getSkill(skill));
      return valsForStat.reduce(
        (numPositive, val) => (val > 0 ? numPositive + 1 : numPositive),
        0
      );
    });
  };
}

class _FriendComputer extends ScriptBase({
  name: 'FriendComputer',
  version: '0.2.0',
  stateKey: 'FRIEND_COMPUTER',
  initialState: {
    charIds: [],
    skillsThisRound: [],
    charSkills: {},
    currCharId: null,
    nextCharId: null,
  },
}) {
  constructor() {
    super();

    on('ready', () => {
      this.createPlayerMacros();
    });

    if (!this.state.charIds) this.state.charIds = [];
    if (!this.state.skillsThisRound) this.state.skillsThisRound = [];
    if (!this.state.charSkills) this.state.charSkills = {};

    if (!CC) {
      throw new Error('CharacterCache must be installed!');
    }

    this.parser = new CommandParser('!computer')
      .command('config', this.config)
      .command('define', () => {
        this.defineGenerator = this.define();
        this.defineGenerator.next();
      })
      .command('skills', () => {
        this.skillGenerator = this.skills();
        this.skillGenerator.next();
      })
      .command('stats', () => {
        this.statsGenerator = this.stats();
        this.statsGenerator.next();
      })
      .command('optimize', () => {
        this.optimizeGenerator = this.optimize();
        this.optimizeGenerator.next();
      })
      .command('redefine', () => {
        this.redefineGenerator = this.redefine();
        this.redefineGenerator.next();
      })
      .command('defineChar', this.defineChar)
      .command('redefineChar', this.redefineChar)
      .command('roll', this.roll)
      .command('takeDamage', this.takeDamage)
      .command('die', this.die)
      .command('reset', (opts, msg) => {
        log('resetting state');
        this.resetState();
      })
      .command('setMacros', this.createPlayerMacros)
      .default((opts, msg) => {
        log('Showing menu to ' + msg.who);
        this.showMenu(msg.who, msg.playerid);
      });
  }

  config = (opts, msg) => {
    const allChars = findObjs({ _type: 'character' });
    Slo.whisper(
      'Computer',
      msg.who,
      this.makeTextBox(
        'Paranoia Config',
        ['Click a character to add/remove from character creation'],
        allChars.map((char) => {
          if (this.state.charIds.includes(char.id)) {
            return {
              text: `✅ ${char.get('name')}`,
              link: this.parser.button({
                group: `computer-config`,
                action: () => {
                  this.state.charIds = this.state.charIds.filter(
                    (id) => id !== char.id
                  );
                  this.config(opts, msg);
                },
              }),
            };
          }
          return {
            text: `🚫 ${char.get('name')}`,
            link: this.parser.button({
              group: `computer-config`,
              action: () => {
                this.state.charIds.push(char.id);
                this.config(opts, msg);
              },
            }),
          };
        })
      )
    );
  };

  define = function* () {
    log("Running 'define' command");
    let characters = this.fetchCharacters();

    sendChat(
      'Computer',
      this.makeTextBox('1. Define', [
        'You will be prompted for your home sector (make it up!) and 3 adjectives for your personality',
        'You can also fill in your gender (not important) and security clearance (extremely important)',
      ])
    );

    if (!this.defineGenerators) this.defineGenerators = {};
    for (const character of characters) {
      this.defineGenerators[character.id] = this.definePlayerGen(character);
      this.defineGenerators[character.id].next();
    }

    for (let i = 0; i < characters.length; i++) {
      yield;
    }

    this.defineGenerator = null;
    sendChat('Computer', 'Define completed!');
  };

  definePlayerGen = function* (character) {
    Slo.whisper(
      'Computer',
      character.name,
      this.makeTextBox(
        character.name,
        [
          `Press the button below`,
          `You will be be asked your home sector and 3 adjectives for your personality`,
        ],
        [
          {
            text: 'Press Me',
            link: `!computer defineChar --id=${character.id} --sector=&#63;{Home Sector} --adj1=&#63;{Adjective One} --adj2=&#63;{Adjective Two} --adj3=&#63;{Adjective Three}`,
          },
        ]
      )
    );

    const { sector, adj1, adj2, adj3 } = yield;
    character.setAttr('sector', sector);
    character.description = [adj1, adj2, adj3];

    // Set some character defaults
    character.moxie = 8;
    character.cloneNumber = 1;
    character.treason = 0;
    character.wounds = 0;

    if (character.id in this.defineGenerators) {
      delete this.defineGenerators[character.id];
      this.defineGenerator.next();
    }
  };

  defineChar = (opts, msg) => {
    this.defineGenerators[opts.id].next({
      sector: opts.sector,
      adj1: opts.adj1,
      adj2: opts.adj2,
      adj3: opts.adj3,
    });
  };

  skills = function* () {
    let characters = this.fetchCharacters();

    sendChat(
      'Computer',
      this.makeTextBox('2. Skills', [
        'Take turns assigning points to skills',
        'The person to your left will receive a negative bonus in the skill you choose',
      ])
    );

    for (let skillBonus = 1; skillBonus <= 5; skillBonus++) {
      for (let i = 0; i < characters.length; i++) {
        let currChar = characters[i];
        let nextChar = characters[(i + 1) % characters.length];

        let skillOpts = SKILLS.filter(
          (skill) =>
            !this.state.skillsThisRound.includes(skill) &&
            !this.state.charSkills[currChar.id].includes(skill)
        );

        let group = `skill-gen-${currChar.id}`;
        let menu = this.makeTextBox(
          currChar.name,
          [
            `Choose a skill to give a +${skillBonus} bonus`,
            `${nextChar.name} will receive a -${skillBonus} in the same skill`,
          ],
          skillOpts.map((opt) => ({
            text: opt,
            link: this.parser.button({
              group,
              action: () => {
                this.skillGenerator.next(opt);
              },
            }),
          }))
        );
        Slo.whisper('Computer', currChar.name, menu);

        let selectedSkill = yield; // This is where the magic happens ✨
        currChar.setSkill(selectedSkill, skillBonus);
        nextChar.setSkill(selectedSkill, -1 * skillBonus);

        this.state.charSkills[currChar.id].push(selectedSkill);
        this.state.charSkills[nextChar.id].push(selectedSkill);
        this.state.skillsThisRound.push(selectedSkill);

        Slo.whisper(
          'Computer',
          currChar.name,
          this.makeAlert('STOP!', 'Someone else is choosing skills')
        );

        Slo.whisper(
          'Computer',
          nextChar.name,
          this.makeTextBox(nextChar.name, [
            `${currChar.name} has given you a -${skillBonus} in ${selectedSkill}!`,
          ])
        );
      }
      this.state.skillsThisRound = [];
      characters = characters.reverse();
    }

    for (const character of characters) {
      for (const SKILL of SKILLS) {
        if (character.getSkill(SKILL) === undefined) {
          character.setSkill(SKILL, 0);
        }
      }
    }

    this.skillsGenerator = null;
    this.state.skillsThisRound = [];
    this.state.charSkills = {};
    sendChat('Computer', 'Skill selection completed!');
  };

  stats = function* () {
    let characters = this.fetchCharacters();

    sendChat(
      'Computer',
      this.makeTextBox('3. Stats', [
        'Assign stat values for the character to your left',
      ])
    );

    for (let i = 0; i < characters.length; i++) {
      let currChar = characters[i];
      let nextChar = characters[(i + 1) % characters.length];

      sendChat(
        'Computer',
        this.makeTextBox('WAIT!', [
          `${currChar.name} is selecting stats for ${nextChar.name}`,
        ])
      );

      let statVals = nextChar.getStatVals();
      const group = `stat-gen-${currChar.id}`;
      for (const STAT of STATS) {
        Slo.whisper(
          'Computer',
          currChar.name,
          this.makeTextBox(
            `Stats for ${nextChar.name}`,
            [`Choose a value for ${nextChar.name}'s ${STAT} stat:`],
            statVals.map((val) => ({
              text: val > 0 ? `+${val}` : `${val}`,
              link: this.parser.button({
                group,
                action: () => {
                  this.statsGenerator.next(val);
                },
              }),
            }))
          )
        );
        const selectedVal = yield;
        Slo.whisper(
          'Computer',
          nextChar.name,
          this.makeTextBox(nextChar.name, [
            `${currChar.name} has assigned your ${STAT} a value of ${selectedVal}!`,
          ])
        );
        nextChar.setSkill(STAT, selectedVal);
        let indexOfSelectedVal = statVals.indexOf(selectedVal);
        statVals = [
          ...statVals.slice(0, indexOfSelectedVal),
          ...statVals.slice(indexOfSelectedVal + 1),
        ];
      }
    }
    this.statsGenerator = null;
    sendChat('Computer', 'Stat selection completed!');
  };

  optimize = function* () {
    let characters = this.fetchCharacters();

    sendChat(
      'Computer',
      this.makeTextBox('4. Optimize', [
        'Tweak your skills and stats by burning clones and moxie',
      ])
    );

    if (!this.optimizeGenerators) this.optimizeGenerators = {};
    for (const character of characters) {
      this.optimizeGenerators[character.id] = this.optimizePlayerGen(character);
      this.optimizeGenerators[character.id].next(true);
      this.optimizeGenerators[character.id].next(true);
    }

    for (let i = 0; i < characters.length; i++) {
      yield;
    }

    this.optimizeGenerator = null;
    sendChat('Computer', 'Optimization completed!');
  };

  optimizePlayerGen = function* (character) {
    while (yield) {
      let moxie = character.moxie;
      let cloneNumber = character.cloneNumber;
      let buttonGroup = `optimize-${character.id}`;

      let options = [
        {
          text: `Done Optimizing`,
          link: this.parser.button({
            group: buttonGroup,
            action: () => this.optimizeGenerators[character.id].next(false),
          }),
        },
      ];

      if (cloneNumber <= 5) {
        options.unshift({
          text: `Burn clone (${6 - cloneNumber}/6)`,
          link: this.parser.button({
            group: buttonGroup,
            action: () => this.burnCloneMenu(character),
          }),
        });
      }

      if (moxie > 3) {
        options.unshift({
          text: `Burn Moxie (${moxie}/8)`,
          link: this.parser.button({
            group: buttonGroup,
            action: () => this.burnMoxieMenu(character),
          }),
        });
      }

      if (options.length === 1) break;

      Slo.whisper(
        'Computer',
        character.name,
        this.makeTextBox(
          'Optimize',
          [
            `You can burn up to 5 Moxie points to raise your skill. One skill point per moxie point.`,
            `You can burn up to 5 clones to raise your stats. One clone per stat point.`,
            `Burning moxie reduces your moxie maximum.`,
            `You can not raise a skill above 5 or a stat above 3.`,
          ],
          options
        )
      );
    }

    if (character.id in this.optimizeGenerators) {
      delete this.optimizeGenerators[character.id];
      this.optimizeGenerator.next();
    }
  };

  burnMoxieMenu = (character) => {
    let options = [];
    let buttonGroup = `burn-moxie-${character.id}`;

    for (const SKILL of SKILLS) {
      let val = character.getSkill(SKILL) || 0;
      if (val < 5) {
        options.push({
          text: `${SKILL} (${val > 0 ? `+${val}` : val})`,
          link: this.parser.button({
            group: buttonGroup,
            action: () => {
              character.setSkill(SKILL, val + 1);
              character.moxie--;
              let moxieMax = character.getSkill('moxie-maximum');
              character.setSkill('moxie-maximum', moxieMax - 1);
              this.optimizeGenerators[character.id].next(true);
            },
          }),
        });
      }
    }

    options.push({
      text: 'Cancel Moxie Burn',
      link: this.parser.button({
        group: buttonGroup,
        action: () => {
          this.optimizeGenerators[opts.id].next(true);
        },
      }),
    });

    Slo.whisper(
      'Computer',
      character.name,
      this.makeTextBox(
        'Burn Moxie',
        [
          `You have ${character.moxie}/8 moxie remaining.`,
          `Spend one to raise a skill by one.`,
        ],
        options
      )
    );
  };

  burnCloneMenu = (character) => {
    let options = [];
    let buttonGroup = `burn-clone-${character.id}`;

    for (const STAT of STATS) {
      let val = character.getSkill(STAT) || 0;
      if (val < 3) {
        options.push({
          text: `${STAT} (${val})`,
          link: this.parser.button({
            group: buttonGroup,
            action: () => {
              character.setSkill(STAT, val + 1);
              character.cloneNumber++;
              this.optimizeGenerators[character.id].next(true);
            },
          }),
        });
      }
    }

    options.push({
      text: 'Cancel Clone Burn',
      link: this.parser.button({
        group: buttonGroup,
        action: () => {
          this.optimizeGenerators[character.id].next(true);
        },
      }),
    });

    Slo.whisper(
      'Computer',
      character.name,
      this.makeTextBox(
        'Burn Clones',
        [
          `You have ${6 - character.cloneNumber}/6 clones remaining.`,
          `Spend one to raise a stat by one.`,
        ],
        options
      )
    );
  };

  redefine = function* () {
    log("Running 'redefine' command");
    let characters = this.fetchCharacters();

    sendChat(
      'Computer',
      this.makeTextBox('6. Redefine', [
        'Look at the character of the person to your left',
        'Choose one of the adjectives in their description and FLIP it to the opposite',
      ])
    );

    for (let i = 0; i < characters.length; i++) {
      let currChar = characters[i];
      let nextChar = characters[(i + 1) % characters.length];

      sendChat(
        'Computer',
        this.makeTextBox('WAIT!', [
          `${currChar.name} is redefining a trait for ${nextChar.name}`,
        ])
      );

      let traits = nextChar.description;
      Slo.whisper(
        'Computer',
        currChar.name,
        this.makeTextBox(
          `Redefine ${nextChar.name}`,
          [`Choose one of ${nextChar.name}'s traits to FLIP to the opposite`],
          traits.map((trait, index) => ({
            text: trait,
            link: `!computer redefineChar --id=${nextChar.id} --traitIdx=${index} --opposite=&#63;{What is the opposite of ${trait}?}`,
          }))
        )
      );

      const { traitIdx, opposite } = yield;
      let oldTrait = traits[traitIdx];
      Slo.whisper(
        'Computer',
        nextChar.name,
        this.makeTextBox(nextChar.name, [
          `${currChar.name} has flipped your ${oldTrait} trait to ${opposite}!`,
        ])
      );
      nextChar.description = [
        ...traits.slice(0, traitIdx),
        opposite,
        ...traits.slice(traitIdx + 1),
      ];
    }

    this.redefineGenerator = null;
    sendChat('Computer', 'Redefine completed!');
  };

  redefineChar = (opts, msg) => {
    this.redefineGenerator.next({
      traitIdx: parseInt(opts.traitIdx),
      opposite: opts.opposite,
    });
  };

  roll = async (opts, msg) => {
    const character = this.getCharacterForPlayer(msg.who, msg.playerid);
    if (!character) {
      throw new Error(`Unable to find a character controlled by ${msg.who}`);
    }

    if (
      !opts.stat ||
      !opts.skill ||
      opts.moxie === undefined ||
      opts.bonus === undefined
    ) {
      throw new Error(
        `Invalid roll command! You must include the following parameters: stat, skill, moxie, bonus`
      );
    }

    let stat = opts.stat;
    let skill = opts.skill;
    let moxie = parseInt(opts.moxie);
    let bonus = parseInt(opts.bonus);

    let currMoxie = character.moxie;
    if (moxie > currMoxie) {
      throw new Error(
        `You can not spend ${moxie} moxie! You only have ${currMoxie} remaining!`
      );
    }

    let node =
      character.getSkill(stat) +
      character.getSkill(skill) +
      moxie +
      bonus -
      character.wounds;
    let negative = node < 0;
    if (negative) node = -node;

    const rollData = await Slo.rollData(`${node}d6 + 1d6`);
    const values = rollData.rolls[0].results.map((result) => result.v);
    const computerDieResult = rollData.rolls[2].results[0].v;

    let successes = values.reduce((successes, value) => {
      if (value >= 5) {
        return successes + 1;
      }
      if (negative) {
        return successes - 1;
      }
      return successes;
    }, 0);

    let computer = computerDieResult === 6;
    if (computerDieResult === 5) {
      successes += 1;
    } else if (computerDieResult < 5 && negative) {
      successes -= 1;
    }

    sendChat(
      'Computer',
      this.makeTextBox(`${character.name}: ${successes}`, [
        `${character.name} rolled ${skill} + ${stat}`,
        bonus !== 0 ? `${bonus > 0 ? '+' + bonus : bonus} bonus` : ``,
        moxie > 0 ? `${moxie} moxie burned` : ``,
        character.wounds > 0 ? `-${character.wounds} penalty for wounds` : ``,
        `Total NODE: ${negative ? '-' + node : node}`,
        `-`,
        `RESULT: ${successes}`,
        computer ? `COMPUTER DICE ACTIVATED!` : ``,
      ])
    );

    if (computer) {
      moxie += 1;
    }
    if (moxie > 0) {
      character.moxie = currMoxie - moxie;
    }
    if (character.moxie === 0) {
      sendChat(
        'Computer',
        this.makeAlert('WARNING!', `${character.name} is about to LOSE IT!`)
      );
    }
  };

  takeDamage = (opts, msg) => {
    const character = this.getCharacterForPlayer(msg.who, msg.playerid);
    if (!character) {
      throw new Error(`Unable to find a character controlled by ${msg.who}`);
    }
    if (opts.damage === undefined) {
      throw new Error(
        `Invalid takeDamage command! You must include the following parameters: damage`
      );
    }
    let damage = parseInt(opts.damage);
    character.takeDamage(damage);
    let wounds = character.wounds;
    let woundStrings = ['HEALTHY', 'HURT', 'INJURED', 'MAIMED', 'DEAD'];
    if (wounds > 0) {
      sendChat(
        'Computer',
        this.makeAlert(`OUCH`, `${character.name} is ${woundStrings[wounds]}`)
      );
      if (wounds === 4) {
        Slo.whisper(
          'Computer',
          character.name,
          `Run the #die macro to get a fresh clone`
        );
      }
    } else {
      Slo.whisper(
        'Computer',
        character.name,
        `You take ${damage} damage but you are unaffected.`
      );
    }
  };

  die = (opts, msg) => {
    const character = this.getCharacterForPlayer(msg.who, msg.playerid);
    if (!character) {
      throw new Error(`Unable to find a character controlled by ${msg.who}`);
    }

    character.treason = 0;
    character.moxie = 8;
    character.cloneNumber++;
    character.wounds = 0;

    sendChat(
      'Computer',
      this.makeTextBox('Computer', [
        `Decanting clone #${character.cloneNumber} for ${character.name}`,
      ])
    );
  };

  /**
   * HELPERS
   */

  getCharacterForPlayer = (name, playerId) => {
    const allChars = findObjs({ _type: 'character' });
    for (const char of allChars) {
      if (char.get('name') === name) return new Troubleshooter(char.id);
    }
    for (const char of allChars) {
      if (char.get('controlledby').includes(playerId))
        return new Troubleshooter(char.id);
    }
    return null;
  };

  fetchCharacters = () => {
    if (this.state.charIds.length < 2)
      throw new Error(
        'Not enough characters! Run !computer config to add characters.'
      );
    for (const id of this.state.charIds) {
      this.state.charSkills[id] = [];
    }
    return this.state.charIds.map((id) => new Troubleshooter(id));
  };

  makeAlert = (warning, description = '') => {
    let menu = new HtmlBuilder('.menu');
    menu.append('.warning', warning);
    menu.append('.description', description);
    return menu.toString(this.WARNING_CSS);
  };

  makeTextBox = (header, sections, buttons) => {
    let menu = new HtmlBuilder('.menu');
    menu.append('.menuHeader', header);

    let textContent = new HtmlBuilder('div');
    for (const section of sections) {
      textContent.append('.section', section);
    }
    menu.append('.textContainer', textContent);

    if (buttons && buttons.length) {
      let buttonContent = new HtmlBuilder('div');
      for (const button of buttons) {
        buttonContent
          .append('.centeredBtn')
          .append('a', button.text, { href: button.link });
      }
      menu.append('.buttonContainer', buttonContent);
    }

    return menu.toString(this.TEXT_BOX_CSS);
  };

  makeMenu = (header, options) => {
    let content = new HtmlBuilder('div');
    for (const option of options) {
      content
        .append('.centeredBtn')
        .append('a', option.text, { href: option.link });
    }
    let menu = new HtmlBuilder('.menu');
    menu.append('.menuHeader', header);
    menu.append('.menuBody', content);
    return menu.toString(this.MENU_CSS);
  };

  showMenu = (who, playerid) => {
    Slo.whisper(
      'Computer',
      who,
      this.makeTextBox(
        'Computer',
        [],
        [
          {
            text: '0. Configure Computer',
            link: '!computer config',
          },
          {
            text: '1. Define',
            link: '!computer define',
          },
          {
            text: '2. Skills',
            link: '!computer skills',
          },
          {
            text: '3. Stats',
            link: '!computer stats',
          },
          {
            text: '4. Optimize',
            link: '!computer optimize',
          },
          {
            text: '6. Redefine',
            link: '!computer redefine',
          },
        ]
      )
    );
  };

  createPlayerMacros = () => {
    let players = findObjs({
      _type: 'player',
    });

    const setMacro = (player, name, macroText) => {
      let [macro] = findObjs({
        _type: 'macro',
        _playerid: player.get('_id'),
        name,
      });
      if (macro) macro.set('action', macroText);
      else
        createObj('macro', {
          _playerid: player.get('_id'),
          name,
          action: macroText,
        });
    };

    // Create the macro, or update the players' old macro if they already have it.
    _.each(players, (player) => {
      setMacro(
        player,
        'roll',
        '!computer roll --skill=?{Pick a skill to use|athletics|guns|melee|throw|bluff|charm|intimidate|stealth|science|psychology|bureaucracy|alpha-complex|operate|engineer|program|demolitions} --stat=?{Pick a stat to use|violence|chutzpah|brains|mechanics} --moxie=?{How many points of moxie do you want to burn|0|1|2|3|4|5|6|7|8} --bonus=?{Any extra bonuses|0}'
      );
      setMacro(
        player,
        'takeDamage',
        '!computer takeDamage --damage=?{What level of damage|Hurt,1|Injured,2|Maimed,3|Dead,4}'
      );
      setMacro(player, 'die', '!computer die');
    });
  };

  WARNING_CSS = {
    warning: {
      color: '#f00',
      'font-size': '36px',
      'font-weight': 'bold',
    },
    description: {
      color: '#f00',
      'font-size': '28px',
      'font-weight': 'bold',
    },
    menu: {
      background: '#fff',
      border: 'solid 1px #000',
      'border-radius': '5px',
      'font-weight': 'bold',
      'margin-bottom': '1em',
      overflow: 'hidden',
    },
  };
  MENU_CSS = {
    centeredBtn: {
      'text-align': 'center',
    },
    menu: {
      background: '#fff',
      border: 'solid 1px #000',
      'border-radius': '5px',
      'font-weight': 'bold',
      'margin-bottom': '1em',
      overflow: 'hidden',
    },
    menuBody: {
      padding: '5px',
      'text-align': 'center',
    },
    menuHeader: {
      background: '#000',
      color: '#fff',
      'text-align': 'center',
    },
  };
  TEXT_BOX_CSS = {
    centeredBtn: {
      'text-align': 'center',
    },
    menu: {
      background: '#fff',
      border: 'solid 1px #000',
      'border-radius': '5px',
      'margin-bottom': '1em',
      overflow: 'hidden',
    },
    textContainer: {
      padding: '5px',
      'text-align': 'left',
    },
    buttonContainer: {
      padding: '5px',
      'padding-top': '12px',
      'border-top': 'solid 1px #000',
      'text-align': 'center',
    },
    section: {
      'margin-bottom': '12px',
    },
    menuHeader: {
      background: '#000',
      color: '#fff',
      'font-weight': 'bold',
      'font-size': '24px',
      'padding-top': '8px',
      'padding-bottom': '8px',
      'text-align': 'center',
    },
  };
}

const FriendComputer = new _FriendComputer();
