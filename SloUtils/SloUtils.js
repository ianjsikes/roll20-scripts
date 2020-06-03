class _Slo {
  version = '0.2.1';

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

  getTokens = (ids) =>
    (ids || []).map(({ _type, _id }) => getObj(_type, _id)).filter((o) => !!o);
}
const Slo = new _Slo();

class CommandParser {
  constructor(trigger) {
    this.trigger = trigger;
    this.defaultCmd;
    this.subCmds = {};
  }

  default(action) {
    this.defaultCmd = { action };
    return this;
  }

  command(name, action) {
    this.subCmds[name] = { action };
    return this;
  }

  handleMessage(msg) {
    if (msg.type !== 'api') return;
    let content = msg.content.trim();
    if (!content.startsWith(this.trigger)) return;
    let [_trigger, subCommand, ...args] = content.split(' ');
    if (
      !subCommand ||
      subCommand.startsWith('--') ||
      !(subCommand in this.subCmds)
    ) {
      if (this.defaultCmd) {
        const opts = this.parseArgs([subCommand, ...args]);
        this.defaultCmd.action(opts, msg);
      } else {
        this.showHelp();
      }
    } else {
      if (subCommand in this.subCmds) {
        const opts = this.parseArgs(args);
        this.subCmds[subCommand].action(opts, msg);
      } else {
        this.showHelp();
      }
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
      if (!state) {
        state[stateKey] = initialState;
      }
    }

    onMessage = (msg) => {
      if (!this.parser) return;
      try {
        this.parser.handleMessage(msg);
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

class _SloCmds extends ScriptBase({ name: 'SLO', version: '0.2.0' }) {
  parser = new CommandParser('!slo')
    .default(() => {
      log(
        'Please use one of the following sub-commands: roll-hp, eldritch-cannon, spiritual-weapon'
      );
    })
    .command('roll-hp', this.rollHP)
    .command('eldritch-cannon', this.eldritchCannon)
    .command('spiritual-weapon', this.spiritualWeapon);

  rollHP = async (opts, msg) => {
    if (!msg.selected || !msg.selected.length) {
      sendChat('SLO', 'Please select one or more tokens to roll health.');
      return;
    }

    for (const selected of msg.selected) {
      try {
        const token = getObj('graphic', selected._id);
        const char = getObj('character', token.get('represents'));
        if (!char) continue;

        const hpFormula = getAttrByName(char.id, 'npc_hpformula');
        if (!hpFormula) continue;
        const hp = await Slo.roll(hpFormula);

        token.set({
          bar1_max: hp,
          bar1_value: hp,
        });
      } catch (err) {
        log(`Error rolling HP for ${token.get('name')}: ${err.message}`);
      }
    }
  };

  eldritchCannon = (opts, msg) => {
    if (!msg.selected || !msg.selected.length) {
      sendChat('SLO', 'Please select a token to cast this spell.');
      return;
    }

    let cannonName = opts.cannonName || "Barb's Cannon";
    let type = opts.type;

    const tok = getObj('graphic', msg.selected[0]._id);
    const char = getObj('character', tok.get('represents'));

    if (!char) {
      sendChat('SLO', 'You must select a token that represents a character.');
      return;
    }
    const playerlist = char.get('controlledby');

    const images = {
      flame:
        'https://s3.amazonaws.com/files.d20.io/images/136911226/m_mCoB2YOYFZw5kZowolFQ/thumb.png?15901038565',
      protector:
        'https://s3.amazonaws.com/files.d20.io/images/136911225/fyBawd6CGVCBaPskFRvXFQ/thumb.png?15901038565',
      ballista:
        'https://s3.amazonaws.com/files.d20.io/images/136911224/FrTS5IYtxDWgaKeBwBRGew/thumb.png?15901038565',
    };
    const imgURL = images[type || 'ballista'];
    const [x, y] = [tok.get('left') + 70, tok.get('top')];

    const [cannonChar] = findObjs({
      _type: 'character',
      name: "Barb's Cannon", // TODO: Think of a good way to _not_ hardcode this
    });
    const level = parseInt(getAttrByName(char.id, 'level'));

    const cannonTok = createObj('graphic', {
      _subtype: 'token',
      represents: cannonChar.id,
      left: x,
      top: y,
      height: 70,
      width: 70,
      pageid: tok.get('pageid'),
      layer: 'objects',
      imgsrc: imgURL,
      name: cannonName,
      controlledby: playerlist,
      showname: true,
      showplayers_name: true,
      bar1_value: level * 5,
      bar1_max: level * 5,
      bar2_value: 18,
      bar3_value: 60,
    });

    const [flameAbility] = findObjs({
      _type: 'ability',
      name: 'Flamethrower',
      _characterid: cannonChar.id,
    });
    const [ballistaAbility] = findObjs({
      _type: 'ability',
      name: 'Force-Ballista',
      _characterid: cannonChar.id,
    });
    const [protectorAbility] = findObjs({
      _type: 'ability',
      name: 'Protector',
      _characterid: cannonChar.id,
    });

    flameAbility.set('istokenaction', !type || type === 'flame');
    ballistaAbility.set('istokenaction', !type || type === 'ballista');
    protectorAbility.set('istokenaction', !type || type === 'protector');

    const chatMsg = `/me unleashes a cannon!`;
    sendChat(tok.get('name'), chatMsg);
    spawnFx(x, y, 'explosion-magic', tok.get('pageid'));
  };

  spiritualWeapon = (opts, msg) => {
    /**
     * The character who casts this spell can set the following attributes on
     * their sheet to customise the token and effects:
     *
     * slo_spiritual_weapon_image - The URL of an image to use for a token
     * slo_spiritual_weapon_message - A message sent in chat when cast
     * slo_spiritual_weapon_name - The name of the created token
     */
    if (!msg.selected || !msg.selected.length) {
      sendChat('SLO', 'Please select a token to cast this spell.');
      return;
    }

    let level = parseInt(opts.level || '2');
    let numDice = Math.floor(level / 2);
    let damage = `${numDice}d8`;

    const tok = getObj('graphic', msg.selected[0]._id);
    const char = getObj('character', tok.get('represents'));

    if (!char) {
      sendChat('SLO', 'You must select a token that represents a character.');
      return;
    }

    const spellMod = getAttrByName(char.id, 'spellcasting_ability');
    const playerlist = char.get('controlledby');

    const imgURL =
      getAttrByName(char.id, 'slo_spiritual_weapon_image') ||
      'https://s3.amazonaws.com/files.d20.io/images/134602233/omFjD3tt9SbO22rWbV-ocA/thumb.png?15895034875';
    const name =
      getAttrByName(char.id, 'slo_spiritual_weapon_name') ||
      `${tok.get('name')}'s Spiritual Weapon`;

    const [x, y] = [tok.get('left') + 70, tok.get('top')];

    const weaponTok = createObj('graphic', {
      _subtype: 'token',
      left: x,
      top: y,
      height: 70,
      width: 70,
      pageid: tok.get('pageid'),
      layer: 'objects',
      imgsrc: imgURL,
      name: name,
      controlledby: playerlist,
    });

    let [attackAbility] = findObjs({
      _type: 'ability',
      _characterid: char.id,
      name: 'SpiritWeaponAtk',
    });

    let charName = char.get('name');
    let attr = (a) => `@{${charName}|${a}}`;
    let atk = `[[${attr('d20')}+${attr('spell_attack_bonus')}]]`;

    let action = `&{template:atkdmg} {{mod=${attr(
      'spell_attack_bonus'
    )}}} {{rname=Spiritual Weapon Attack}} {{r1=${atk}}} {{always=1}} {{r2=${atk}}} {{attack=1}} {{range=5 ft.}} {{damage=1}} {{dmg1flag=1}} {{dmg1=[[${damage}+${attr(
      'spellcasting_ability'
    )}]]}} {{dmg1type=force}} {{crit=1}} {{crit1=${
      numDice * 8
    }}} {{charname=${charName}}}`;
    if (attackAbility) {
      attackAbility.set({ action });
    } else {
      attackAbility = createObj('ability', {
        _characterid: char.id,
        name: 'SpiritWeaponAtk',
        action,
        istokenaction: true,
      });
    }

    const chatMsg =
      getAttrByName(char.id, 'slo_spiritual_weapon_message') ||
      'I summoned a spiritual weapon.';
    sendChat(tok.get('name'), chatMsg);
    spawnFx(x, y, 'burst-holy', tok.get('pageid'));
  };
}
const SloCmds = new _SloCmds();
