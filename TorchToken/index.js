const TorchToken = (() => {
  const version = '0.8.13';
  const schemaVersion = 0.1;
  const torchURL =
    'https://s3.amazonaws.com/files.d20.io/images/23748/thumb.png?1339110097';

  const ch = (c) => {
    const entities = {
      '<': 'lt',
      '>': 'gt',
      "'": '#39',
      '@': '#64',
      '{': '#123',
      '|': '#124',
      '}': '#125',
      '[': '#91',
      ']': '#93',
      '"': 'quot',
      '*': 'ast',
      '/': 'sol',
      ' ': 'nbsp',
    };

    if (entities.hasOwnProperty(c)) {
      return `&${entities[c]};`;
    }
    return '';
  };

  const selectedTokens = (msg = {}) =>
    (msg.selected || [])
      .map(({ _type, _id }) => getObj(_type, _id))
      .filter((o) => !!o);

  const handleInput = (msg) => {
    if (msg.type !== 'api') {
      return;
    }

    let [
      cmd,
      subcmd,
      rad = 40,
      dimRad = parseInt(rad) / 2,
      allPlayers = 'yes',
      tokenId,
      angle = 360,
    ] = msg.content.split(' ');
    if (cmd !== '!ttorch') {
      return;
    }

    let otherPlayers = _.contains(
      [1, '1', 'on', 'yes', 'true', 'sure', 'yup', '-'],
      allPlayers
    );
    angle = Math.min(360, Math.max(0, parseInt(angle)));

    let tokenParam = tokenId && findObjs({ _id: tokenId });
    let tokens = tokenParam ? [tokenParam] : selectedTokens(msg);
    switch (subcmd) {
      case 'light':
        for (const token of tokens) {
          if (token.id in state.TorchToken.torches) {
            // A torch can't light another torch!
            continue;
          }
          if (!(token.id in state.TorchToken.torchBearers)) {
            state.TorchToken.torchBearers[token.id] = {
              id: token.id,
              light_radius: token.get('light_radius'),
              light_dimradius: token.get('light_dimradius'),
              light_angle: token.get('light_angle'),
              light_otherplayers: token.get('light_otherplayers'),
            };
          }

          token.set({
            light_radius: rad,
            light_dimradius: dimRad,
            light_otherplayers: otherPlayers,
            light_angle: angle,
          });
        }
        break;
      // case 'pickup':
      //   for (const token of tokens) {
      //   }
      //   break;
      case 'drop':
        for (const token of tokens) {
          if (token.id in state.TorchToken.torches) {
            // A torch can't drop another torch!
            continue;
          }

          if (!(token.id in state.TorchToken.torchBearers)) {
            continue;
          }

          let torch = createObj('graphic', {
            _subtype: 'token',
            _pageid: token.get('_pageid'),
            imgsrc: torchURL,
            layer: token.get('layer'),
            name: 'torch',
            controlledby: 'all',
            left: token.get('left'),
            top: token.get('top'),
            width: 70,
            height: 70,
            light_radius: token.get('light_radius'),
            light_dimradius: token.get('light_dimradius'),
            light_angle: token.get('light_angle'),
            light_otherplayers: token.get('light_otherplayers'),
          });
          state.TorchToken.torches[torch.id] = { id: torch.id };

          const bearer = state.TorchToken.torchBearers[token.id];
          token.set({
            light_radius: bearer.light_radius,
            light_dimradius: bearer.light_dimradius,
            light_angle: bearer.light_angle,
            light_otherplayers: bearer.light_otherplayers,
          });
          delete state.TorchToken.torchBearers[token.id];
        }
        break;
      case 'snuff':
        for (const token of tokens) {
          if (token.id in state.TorchToken.torches) {
            // A torch can't snuff another torch!
            continue;
          }

          if (!(token.id in state.TorchToken.torchBearers)) {
            continue;
          }
          const bearer = state.TorchToken.torchBearers[token.id];
          token.set({
            light_radius: bearer.light_radius,
            light_dimradius: bearer.light_dimradius,
            light_angle: bearer.light_angle,
            light_otherplayers: bearer.light_otherplayers,
          });
          delete state.TorchToken.torchBearers[token.id];
        }
        break;
      default:
        // TODO: Show help message
        break;
    }
  };

  const handleTokenDelete = (obj) => {
    if (obj.id in state.TorchToken.torches) {
      delete state.TorchToken.torches[obj.id];
    }
    if (obj.id in state.TorchToken.torchBearers) {
      delete state.TorchToken.torchBearers[obj.id];
    }
  };

  const checkInstall = () => {
    if (!state.TorchToken) {
      state.TorchToken = {
        torches: {},
        torchBearers: {},
      };
    }
  };

  const registerEventHandlers = () => {
    on('chat:message', handleInput);
    on('destroy:graphic', handleTokenDelete);
  };

  on('ready', () => {
    checkInstall();
    registerEventHandlers();
  });

  return {};
})();
