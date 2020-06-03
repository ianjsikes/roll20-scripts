class _Carrier extends ScriptBase({
  name: 'Carrier',
  version: '0.1.0',
  stateKey: 'CARRIER',
  initialState: {},
}) {
  constructor() {
    super();
  }

  parser = new CommandParser('!carrier')
    .default(() => {})
    .command('', this.foo);
}
