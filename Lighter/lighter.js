var Lighter = (() => {
  'use strict';

  const LIGHTS = {
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

  let MENU_CSS = {
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

  const getTokens = (ids) =>
    (ids || []).map(({ _type, _id }) => getObj(_type, _id)).filter((o) => !!o);

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
            return { ...opts, [key]: val };
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

  const parser = new CommandParser('!lighter')
    .default((opts, msg) => {
      log('Showing menu to ' + msg.who);
      _showMenu(msg.who, msg.playerid);
    })
    .command('light', (opts, msg) => {
      log("Running 'light' command");
      let type = opts.type || 'torch';
      let target = opts.target || msg.selected;
      target = Array.isArray(target) ? target[0] : target;
      log(`type: ${type}, target: ${target}`);

      // If selected token is an unlit light source, just re-light it.
      if (
        target in state.Lighter.lightTokens &&
        !state.Lighter.lightTokens[target].lit
      ) {
        log('target is light, relighting it');
        toggleLightSource(getObj('graphic', target));
        return;
      }

      // If selected token is carrying an unlight light, re-light it.
      if (target in state.Lighter.carriers) {
        log('target is carrier');
        const carrierState = state.Lighter.carriers[target];
        if (!state.Lighter.lightTokens[carrierState.carrying].lit) {
          log('relighting carried light');
          toggleLightSource(getObj('graphic', carrierState.carrying));
        }
        return;
      }

      log('creating light source token');
      const light = LIGHTS[type] || LIGHTS.torch;
      const carrier = getObj('graphic', target);
      const lightToken = createObj('graphic', {
        _subtype: 'token',
        _pageid: carrier.get('_pageid'),
        imgsrc: light.tokenURL,
        layer: carrier.get('layer'),
        name: light.name,
        controlledby: carrier.id,
        left: carrier.get('left'),
        top: carrier.get('top'),
        width: 70,
        height: 70,
        light_radius: light.radius,
        light_dimradius: light.dimradius,
        light_angle: 360,
        light_otherplayers: true,
      });

      state.Lighter.carriers[carrier.id] = {
        carrying: lightToken.id,
      };
      state.Lighter.lightTokens[lightToken.id] = {
        id: lightToken.id,
        carriedBy: carrier.id,
        type,
        lit: true,
      };

      CarryTokens.carryBelow(carrier, lightToken);
    })
    .command('drop', (opts, msg) => {
      log('drop command');
      let target = opts.target || msg.selected;
      target = Array.isArray(target) ? target[0] : target;
      log(`target ${target}`);

      if (target in state.Lighter.carriers) {
        log('target is carrier, dropping torch');
        const carrier = getObj('graphic', target);
        const lightToken = getObj(
          'graphic',
          state.Lighter.carriers[target].carrying
        );

        CarryTokens.drop(carrier, lightToken);
        lightToken.set({
          controlledby: 'all',
        });

        delete state.Lighter.carriers[carrier.id];
        state.Lighter.lightTokens[lightToken.id].carriedBy = null;
      }
    })
    .command('snuff', (opts, msg) => {
      log('snuff cmd');
      let target = opts.target || msg.selected;
      target = Array.isArray(target) ? target[0] : target;
      log(`target ${target}`);

      // If selected token is a lit light source, snuff it.
      if (
        target in state.Lighter.lightTokens &&
        state.Lighter.lightTokens[target].lit
      ) {
        log('target is light, snuffing it');
        toggleLightSource(getObj('graphic', target));
        return;
      }

      // If selected token is carrying an unlight light, snuff it.
      if (target in state.Lighter.carriers) {
        log('target is carrier');
        const carrierState = state.Lighter.carriers[target];
        if (state.Lighter.lightTokens[carrierState.carrying].lit) {
          log('snuffing carried light');
          toggleLightSource(getObj('graphic', carrierState.carrying));
        }
        return;
      }
    })
    .command('pickup', (opts, msg) => {
      log('pickup cmd');
      let carrierId = opts.carrier;
      let lightId = opts.light;

      log(`carrierId: ${carrierId} - lightId: ${lightId}`);

      if (!carrierId || !lightId) return;

      if (!(lightId in state.Lighter.lightTokens)) return;
      if (carrierId in state.Lighter.carriers) return;

      log('picking up light');

      const carrier = getObj('graphic', carrierId);
      const lightToken = getObj('graphic', lightId);

      CarryTokens.carryBelow(carrier, lightToken);
      lightToken.set({
        controlledby: carrierId,
      });

      state.Lighter.carriers[carrierId] = { carrying: lightId };
      state.Lighter.lightTokens[lightId].carriedBy = carrierId;
    })
    .command('reset', (opts, msg) => {
      log('resetting state');
      state.Lighter = {
        carriers: {},
        lightTokens: {},
      };
    });

  function toggleLightSource(lightToken) {
    const lightState = state.Lighter.lightTokens[lightToken.id];
    if (lightState.lit) {
      lightState.lit = false;
      lightToken.set({
        light_radius: 0,
        light_dimradius: 0,
        light_angle: 0,
        light_otherplayers: false,
      });
    } else {
      lightState.lit = true;
      const light = LIGHTS[lightState.type];
      lightToken.set({
        light_radius: light.radius,
        light_dimradius: light.dimradius,
        light_angle: 360,
        light_otherplayers: true,
      });
    }
  }

  on('chat:message', (msg) => {
    try {
      parser.handleMessage(msg);
    } catch (err) {
      log('Lighter ERROR: ' + err.message);
      sendChat('Lighter ERROR:', '/w ' + _fixWho(msg.who) + ' ' + err.message);
      log(err.stack);
    }
  });

  /**
   * Fixes msg.who.
   * @param {string} who
   * @return {string}
   */
  function _fixWho(who) {
    return who.replace(/\(GM\)/, '').trim();
  }

  /**
   * Shows the list of effects which can be applied to a selected path.
   * @param {string} who
   * @param {string} playerid
   */
  function _showMenu(who, playerid) {
    let content = new HtmlBuilder('div');

    const promptOpts = Object.values(LIGHTS)
      .map((light) => `${light.name}, ${light.id}`)
      .join('|');
    content.append('.centeredBtn').append('a', 'Create Light', {
      href: `!lighter light --type=&#63;{Light Type|${promptOpts}} --target=&#64;{selected|token_id}`,
    });
    content.append('.centeredBtn').append('a', 'Drop Light', {
      href: `!lighter drop --target=&#64;{selected|token_id}`,
    });
    content.append('.centeredBtn').append('a', 'Pickup Light', {
      href: `!lighter pickup --carrier=&#64;{selected|token_id} --light=&#64;{target|token_id}`,
    });
    content.append('.centeredBtn').append('a', 'Relight Light', {
      href: `!lighter light --target=&#64;{selected|token_id}`,
    });
    content.append('.centeredBtn').append('a', 'Snuff Light', {
      href: '!lighter snuff --target=&#64;{selected|token_id}',
    });

    let menu = new HtmlBuilder('.menu');
    menu.append('.menuHeader', 'Create Light Source');
    menu.append('.menuBody', content);
    _whisper(who, menu.toString(MENU_CSS));
  }

  function _whisper(who, msg) {
    sendChat('Lighter', '/w "' + _fixWho(who) + '" ' + msg);
  }

  function handleTokenDelete(obj) {
    if (obj.id in state.Lighter.lightTokens) {
      delete state.Lighter.lightTokens[obj.id];
    }
    if (obj.id in state.Lighter.carriers) {
      delete state.Lighter.carriers[obj.id];
    }
  }

  // Create macros
  on('ready', () => {
    if (!state.Lighter) {
      state.Lighter = {
        lightTokens: {},
        carriers: {},
      };
    }

    on('destroy:graphic', handleTokenDelete);

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

    log('--- Initialized Lighter ---');
  });

  return {};
})();
