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

    log('DOES have attribute');
    let [currAttribute] = findObjs({
      _type: 'attribute',
      _characterid: this.id,
      name: attr,
    });
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
   * MOXIE
   */

  initializeMoxie() {
    for (let i = 1; i <= 8; i++) {
      this.setAttr(`moxie-level-${i}`, 'on');
    }
  }

  get moxie() {
    let levels = [1, 2, 3, 4, 5, 6, 7, 8].map((num) =>
      this.getAttr(`moxie-level-${num}`)
    );

    if (levels.some((level) => level === undefined)) {
      this.initializeMoxie();
      return 8;
    }

    return levels.reduce(
      (count, level) => (level === 'on' ? count + 1 : count),
      0
    );
  }

  set moxie(num) {
    for (let i = 1; i <= 8; i++) {
      if (i <= num) {
        this.setAttr(`moxie-level-${i}`, 'on');
      } else {
        this.setAttr(`moxie-level-${i}`, 0);
      }
    }
  }

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

class _ParanoiaWizard extends ScriptBase({
  name: 'ParanoiaWizard',
  version: '0.1.0',
  stateKey: 'PARANOIA_WIZARD9',
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
    if (!this.state.charIds) this.state.charIds = [];
    if (!this.state.skillsThisRound) this.state.skillsThisRound = [];
    if (!this.state.charSkills) this.state.charSkills = {};

    if (!CC) {
      throw new Error('CharacterCache must be installed!');
    }
    this.playerGenerators = {};

    this.parser = new CommandParser('!computer')
      .command('stats', this.stats)
      .command('optimize', this.optimize)
      .command('optimizeDone', this.optimizeDone)
      .command('burnMoxieMenu', this.burnMoxieMenu)
      .command('burnCloneMenu', this.burnCloneMenu)
      .command('burnMoxie', this.burnMoxie)
      .command('burnClone', this.burnClone)
      .command('cancelBurn', this.cancelBurn)
      .default((opts, msg) => {
        log('Showing menu to ' + msg.who);
        this.showMenu(msg.who, msg.playerid);
      })
      .command('define', this.define)
      .command('skills', this.skills)
      .command('boost', this.boost)
      .command('assignStat', this.assignStat)
      // .command('snuff', this.snuff)
      // .command('pickup', this.pickup)
      .command('reset', (opts, msg) => {
        log('resetting state');
        this.resetState();
      });
  }

  fetchCharacters = () => {
    const chars = findObjs({ _type: 'character' });
    this.state.charIds = chars.map((char) => char.id);
    for (const id of this.state.charIds) {
      this.state.charSkills[id] = [];
    }
    let charIds = this.state.charIds;

    if (charIds.length < 2) throw new Error('Not enough characters!');
    let characters = charIds.map((charId) => new Troubleshooter(charId));
    return characters;
  };

  define = (opts, msg) => {
    log("Running 'define' command");

    let content = new HtmlBuilder('div');
    content.append('.section', 'a) Create a new character');
    content.append('.section', 'b) Come up with a name');
    content.append('.section', 'c) Enter your security clearance (red)');
    content.append('.section', 'd) Enter your home sector (make it up)');
    content.append(
      '.section',
      'e) Your clone number starts at 1. Make it count!'
    );
    content.append('.section', "f) Enter your gender (or don't)");
    content.append('.section', 'g) Come up with 3 adjectives for personality');

    let menu = new HtmlBuilder('.menu');
    menu.append('.menuHeader', '1. Define');
    menu.append('.menuBody', content);
    sendChat('Computer', menu.toString(this.TEXT_BOX_CSS));
  };

  skills = (opts, msg) => {
    log("Running 'skills' command");

    // let content = new HtmlBuilder('div');
    // content.append('.section', 'a) Create a new character');
    // content.append('.section', 'b) Come up with a name');
    // content.append('.section', 'c) Enter your security clearance (red)');
    // content.append('.section', 'd) Enter your home sector (make it up)');
    // content.append(
    //   '.section',
    //   'e) Your clone number starts at 1. Make it count!'
    // );
    // content.append('.section', "f) Enter your gender (or don't)");
    // content.append('.section', 'g) Come up with 3 adjectives for personality');

    // let menu = new HtmlBuilder('.menu');
    // menu.append('.menuHeader', '2. Skills');
    // menu.append('.menuBody', content);
    // sendChat('Computer', menu.toString(this.TEXT_BOX_CSS));

    this.skillGenerator = this.skillGen();
    this.skillGenerator.next();
  };

  boost = (opts, msg) => {
    if (!this.skillGenerator) throw new Error('Generator inactive!');

    if (
      opts.curr !== this.state.currCharId ||
      opts.next !== this.state.nextCharId
    ) {
      throw new Error(
        "Hey! Don't click that button again! Invalid state detected."
      );
    }

    this.skillGenerator.next(opts.skill);
  };

  skillGen = function* () {
    const chars = findObjs({ _type: 'character' });
    this.state.charIds = chars.map((char) => char.id);
    for (const id of this.state.charIds) {
      this.state.charSkills[id] = [];
    }
    let charIds = this.state.charIds;

    if (charIds.length < 2) throw new Error('Not enough characters!');
    let characters = charIds.map((charId) => new Troubleshooter(charId));

    for (let skillBonus = 1; skillBonus <= 5; skillBonus++) {
      for (let i = 0; i < charIds.length; i++) {
        this.state.currCharId = charIds[i];
        this.state.nextCharId =
          i === charIds.length - 1 ? charIds[0] : charIds[i + 1];

        let currChar = new Troubleshooter(this.state.currCharId);
        let nextChar = new Troubleshooter(this.state.nextCharId);

        let skillOpts = SKILLS.filter(
          (skill) =>
            !this.state.skillsThisRound.includes(skill) &&
            !this.state.charSkills[currChar.id].includes(skill)
        );

        let menu = this.makeTextBox(
          currChar.name,
          [
            `Choose a skill to give a +${skillBonus} bonus`,
            `${nextChar.name} will receive a -${skillBonus} in the same skill`,
          ],
          skillOpts.map((opt) => ({
            text: opt,
            link: `!computer boost --skill=${opt} --amount=${skillBonus} --curr=${this.state.currCharId} --next=${this.state.nextCharId}`,
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
      this.state.charIds = this.state.charIds.reverse();
    }
    this.skillsGenerator = null;
    this.state.skillsThisRound = [];
    this.state.charSkills = {};
    sendChat('Computer', 'Skill selection completed!');
  };

  stats = (opts, msg) => {
    this.statsGenerator = this.statsGen();
    this.statsGenerator.next();
  };

  statsGen = function* () {
    let characters = this.fetchCharacters();

    for (let i = 0; i < characters.length; i++) {
      let currChar = characters[i];
      let nextChar =
        i === characters.length - 1 ? characters[0] : characters[i + 1];

      sendChat(
        'Computer',
        this.makeTextBox('WAIT!', [
          `${currChar.name} is selecting stats for ${nextChar.name}`,
        ])
      );

      let statVals = nextChar.getStatVals();
      for (const STAT of STATS) {
        Slo.whisper(
          'Computer',
          currChar.name,
          this.makeTextBox(
            `Stats for ${nextChar.name}`,
            [`Choose a value for ${nextChar.name}'s ${STAT} stat:`],
            statVals.map((val) => ({
              text: val > 0 ? `+${val}` : `${val}`,
              link: `!computer assignStat --stat=${STAT} --to=${nextChar.id} --val=${val}`,
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

  assignStat = (opts, msg) => {
    if (!this.statsGenerator) throw new Error('Generator inactive!');
    this.statsGenerator.next(parseInt(opts.val));
  };

  optimize = (opts, msg) => {
    log('Running optimize command');
    this.optimizeGenerator = this.optimizeGen();
    this.optimizeGenerator.next();
  };

  optimizeGen = function* () {
    let characters = this.fetchCharacters();
    log('fetched chars');
    for (const character of characters) {
      log(`Kicking off optimize generator for ${character.name}`);
      this.playerGenerators[character.id] = this.optimizePlayerGen(character);
      this.playerGenerators[character.id].next(true);
      this.playerGenerators[character.id].next(true);
    }

    for (let i = 0; i < characters.length; i++) {
      yield;
      log(`ONE PLAYER FINISHED, ${characters.length - (i + 1)} remaining`);
    }

    this.optimizeGenerator = null;
    sendChat('Computer', 'Optimization completed!');
  };

  optimizeDone = (opts, msg) => {
    if (!(opts.id in this.playerGenerators) || !this.optimizeGenerator) {
      throw new Error('Invalid operation :(');
    }
    this.playerGenerators[opts.id].next(false);
  };

  optimizePlayerGen = function* (character) {
    log(`Optimize player generator start--- ${character.name}`);
    while (yield) {
      log(`Executing loop for optimize player gen ${character.name}`);
      let moxie = character.moxie;
      let cloneNumber = character.cloneNumber;
      log(`Current vals (moxie ${moxie}) (clones ${cloneNumber})`);

      let options = [
        {
          text: `Done Optimizing`,
          link: `!computer optimizeDone --id=${character.id}`,
        },
      ];
      if (cloneNumber <= 5) {
        options.unshift({
          text: `Burn clone (${6 - cloneNumber}/6)`,
          link: `!computer burnCloneMenu --id=${character.id}`,
        });
      }
      if (moxie > 3) {
        options.unshift({
          text: `Burn Moxie (${moxie}/8)`,
          link: `!computer burnMoxieMenu --id=${character.id}`,
        });
      }
      if (options.length === 1) break;
      log(`whispering optimize menu`);
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
    log(`optimize player gen DONE for ${character.name}`);
    if (character.id in this.playerGenerators) {
      log(`Wrapping up gen`);
      delete this.playerGenerators[character.id];
      this.optimizeGenerator.next();
    }
  };

  burnMoxieMenu = (opts, msg) => {
    if (!(opts.id in this.playerGenerators) || !this.optimizeGenerator) {
      throw new Error('Invalid operation :(');
    }

    let character = new Troubleshooter(opts.id);
    let options = SKILLS.reduce((options, skill) => {
      let val = character.getSkill(skill) || 0;
      if (val < 5) {
        return [...options, { skill, val }];
      }
      return options;
    }, []).map(({ skill, val }) => ({
      text: `${skill} (${val > 0 ? '+' + val : val})`,
      link: this.parser.button({
        group: `burn-moxie-${character.id}`,
        action: () => {
          const currentSkillVal = character.getSkill(skill);
          character.setSkill(skill, currentSkillVal ? currentSkillVal + 1 : 1);
          character.moxie = character.moxie - 1;
          this.playerGenerators[character.id].next(true);
        },
      }),
      // link: `!computer burnMoxie --skill=${skill} --id=${character.id}`,
    }));
    options.push({
      text: 'Cancel Moxie Burn',
      link: `!computer cancelBurn --id=${character.id}`,
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
  burnCloneMenu = (opts, msg) => {
    if (!(opts.id in this.playerGenerators) || !this.optimizeGenerator) {
      throw new Error('Invalid operation :(');
    }

    let character = new Troubleshooter(opts.id);
    let options = STATS.reduce((options, stat) => {
      let val = character.getSkill(stat) || 0;
      if (val < 3) {
        return [...options, { stat, val }];
      }
      return options;
    }, []).map(({ stat, val }) => ({
      text: `${stat} (${val})`,
      link: `!computer burnClone --stat=${stat} --id=${character.id}`,
    }));
    options.push({
      text: 'Cancel Clone Burn',
      link: `!computer cancelBurn --id=${character.id}`,
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

  burnMoxie = (opts, msg) => {
    if (
      !(opts.id in this.playerGenerators) ||
      !this.optimizeGenerator ||
      !opts.skill
    ) {
      throw new Error('Invalid operation :(');
    }

    const character = new Troubleshooter(opts.id);
    const currentSkillVal = character.getSkill(opts.skill);
    character.setSkill(opts.skill, currentSkillVal ? currentSkillVal + 1 : 1);
    character.moxie = character.moxie - 1;
    this.playerGenerators[opts.id].next(true);
  };
  burnClone = (opts, msg) => {
    if (
      !(opts.id in this.playerGenerators) ||
      !this.optimizeGenerator ||
      !opts.stat
    ) {
      throw new Error('Invalid operation :(');
    }

    const character = new Troubleshooter(opts.id);
    const currentStatVal = character.getSkill(opts.stat);
    character.setSkill(opts.stat, currentStatVal ? currentStatVal + 1 : 1);
    character.cloneNumber = character.cloneNumber + 1;
    this.playerGenerators[opts.id].next(true);
  };

  cancelBurn = (opts, msg) => {
    if (!(opts.id in this.playerGenerators) || !this.optimizeGenerator) {
      throw new Error('Invalid operation :(');
    }
    this.playerGenerators[opts.id].next(true);
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
    let content = new HtmlBuilder('div');

    content.append('.centeredBtn').append('a', '1. Define', {
      href: `!computer define`,
    });
    content.append('.centeredBtn').append('a', '2. Skills', {
      href: `!lighter drop --target=&#64;{selected|token_id}`,
    });
    content.append('.centeredBtn').append('a', '3. Stats', {
      href: `!lighter pickup --carrier=&#64;{selected|token_id} --light=&#64;{target|token_id}`,
    });
    content.append('.centeredBtn').append('a', '4. Optimising', {
      href: `!lighter light --target=&#64;{selected|token_id}`,
    });
    content.append('.centeredBtn').append('a', '5. Details', {
      href: '!lighter snuff --target=&#64;{selected|token_id}',
    });
    content.append('.centeredBtn').append('a', '6. Redefine', {
      href: '!lighter snuff --target=&#64;{selected|token_id}',
    });

    let menu = new HtmlBuilder('.menu');
    menu.append('.menuHeader', 'Create Light Source');
    menu.append('.menuBody', content);
    Slo.whisper('Lighter', who, menu.toString(this.MENU_CSS));
  };

  isLightToken = (token) => {
    return token && token.get('bar1_max') === 'light';
  };

  isLit = (token) => {
    return token && token.get('light_otherplayers');
  };

  handleTokenDelete = (obj) => {
    if (this.isLightToken(obj)) {
      const [id] =
        Object.entries(this.state.carriers).find(
          ([id, carrier]) => carrier.carrying === obj.id
        ) || [];

      if (id) {
        delete this.state.carriers[id];
      }
    }
    if (obj.id in this.state.carriers) {
      delete this.state.carriers[obj.id];
    }
  };

  createPlayerMacros = () => {
    let players = findObjs({
      _type: 'player',
    });

    // Create the macro, or update the players' old macro if they already have it.
    _.each(players, (player) => {
      let macro = findObjs({
        _type: 'macro',
        _playerid: player.get('_id'),
        name: 'lighter',
      })[0];

      if (macro) macro.set('action', '!lighter');
      else
        createObj('macro', {
          _playerid: player.get('_id'),
          name: 'lighter',
          action: '!lighter',
        });
    });
  };

  toggleLightSource = (lightToken) => {
    if (this.isLit(lightToken)) {
      lightToken.set({
        light_radius: 0,
        light_dimradius: 0,
        light_angle: 0,
        light_otherplayers: false,
      });
    } else {
      const light = this.LIGHTS[lightToken.get('bar2_max')];
      lightToken.set({
        light_radius: light.radius,
        light_dimradius: light.dimradius,
        light_angle: 360,
        light_otherplayers: true,
      });
    }
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

  LIGHTS = {
    candle: {
      name: 'Candle',
      id: 'candle',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/62414/thumb.png?1340842182',
      radius: 5,
      dimradius: -5,
    },
    torch: {
      name: 'Torch',
      id: 'torch',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/23748/thumb.png?1339110097',
      radius: 40,
      dimradius: 20,
    },
    lamp: {
      name: 'Lamp',
      id: 'lamp',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/137668/du0U5GI3StRczdy7SkAfYA/thumb.png?1344196925',
      radius: 30,
      dimradius: 15,
    },
    lantern: {
      name: 'Lantern',
      id: 'lantern',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/28477/thumb.png?1339344178',
      radius: 60,
      dimradius: 30,
    },
    sunrod: {
      name: 'Sunrod',
      id: 'sunrod',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/2839037/ePdiTJqJHV5iPMicIVarrg/thumb.png?1390468546',
      radius: 60,
      dimradius: 30,
    },
    light: {
      name: 'Light Spell',
      id: 'light',
      tokenURL:
        'https://s3.amazonaws.com/files.d20.io/images/15362/thumb.png?1338195628',
      radius: 40,
      dimradius: 20,
    },
  };
}

const ParanoiaWizard = new _ParanoiaWizard();
