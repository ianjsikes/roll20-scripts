class _Lighter extends ScriptBase({
  name: 'Lighter',
  version: '0.2.0',
  stateKey: 'LIGHTER',
  initialState: {
    carriers: {},
  },
}) {
  constructor() {
    super();

    if (!TC) {
      throw new Error('TokenCache must be installed!');
    }

    on('destroy:graphic', this.handleTokenDelete);
    on('ready', () => {
      this.createPlayerMacros();
    });

    this.parser = new CommandParser('!lighter')
      .default((opts, msg) => {
        log('Showing menu to ' + msg.who);
        this.showMenu(msg.who, msg.playerid);
      })
      .command('light', this.light)
      .command('drop', this.drop)
      .command('snuff', this.snuff)
      .command('pickup', this.pickup)
      .command('reset', (opts, msg) => {
        log('resetting state');
        this.resetState();
      });
  }

  light = (opts, msg) => {
    log("Running 'light' command");
    let type = opts.type || 'torch';
    let target = opts.target || msg.selected;
    target = Array.isArray(target) ? target[0]._id : target;
    log(`type: ${type}, target: ${target}`);

    // If selected token is an unlit light source, just re-light it.
    let targetToken = TC[target];
    if (this.isLightToken(targetToken) && !this.isLit(targetToken)) {
      log('target is light, relighting it');
      this.toggleLightSource(targetToken);
      return;
    }

    // If selected token is carrying an unlight light, re-light it.
    if (target in this.state.carriers) {
      log('target is carrier');
      const carrierState = this.state.carriers[target];
      const carriedToken = TC[carrierState.carrying];

      if (this.isLightToken(carriedToken) && !this.isLit(carriedToken)) {
        log('relighting carried light');
        this.toggleLightSource(carriedToken);
      }
      return;
    }

    log('creating light source token');
    const light = this.LIGHTS[type] || this.LIGHTS.torch;
    const carrier = TC[target];
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
      bar1_max: 'light',
      bar2_max: type || 'torch',
    });

    this.state.carriers[carrier.id] = {
      carrying: lightToken.id,
    };

    CarryTokens.carryBelow(carrier, lightToken);
  };

  drop = (opts, msg) => {
    log('drop command');
    let target = opts.target || msg.selected;
    target = Array.isArray(target) ? target[0]._id : target;
    log(`target ${target}`);

    if (target in this.state.carriers) {
      log('target is carrier, dropping torch');
      const carrier = TC[target];
      const lightToken = TC[this.state.carriers[target].carrying];

      CarryTokens.drop(carrier, lightToken);
      lightToken.set({
        controlledby: 'all',
      });

      delete this.state.carriers[carrier.id];
    }
  };

  snuff = (opts, msg) => {
    log('snuff cmd');
    let target = opts.target || msg.selected;
    target = Array.isArray(target) ? target[0]._id : target;
    log(`target ${target}`);

    // If selected token is a lit light source, snuff it.
    let targetToken = TC[target];
    if (this.isLightToken(targetToken) && this.isLit(targetToken)) {
      log('target is light, snuffing it');
      this.toggleLightSource(targetToken);
      return;
    }

    // If selected token is carrying an unlight light, snuff it.
    if (target in this.state.carriers) {
      log('target is carrier');
      const carrierState = this.state.carriers[target];
      const carriedToken = TC[carrierState.carrying];
      if (this.isLightToken(carriedToken) && this.isLit(carriedToken)) {
        log('snuffing carried light');
        this.toggleLightSource(carriedToken);
      }
      return;
    }
  };

  pickup = (opts, msg) => {
    log('pickup cmd');
    let carrierId = opts.carrier;
    let lightId = opts.light;

    log(`carrierId: ${carrierId} - lightId: ${lightId}`);

    if (!carrierId || !lightId) return;

    const carrier = TC[carrierId];
    const lightToken = TC[lightId];

    if (!this.isLightToken(lightToken)) return;
    if (carrierId in this.state.carriers) return;

    log('picking up light');

    CarryTokens.carryBelow(carrier, lightToken);
    lightToken.set({
      controlledby: carrierId,
    });

    this.state.carriers[carrierId] = { carrying: lightId };
  };

  showMenu = (who, playerid) => {
    let content = new HtmlBuilder('div');

    const promptOpts = Object.values(this.LIGHTS)
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

const Lighter = new _Lighter();
