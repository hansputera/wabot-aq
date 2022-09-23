const { SessionManager } = require('gampang');
// const path = require('node:path');

module.exports = {
  'qr': {
    'store': 'web', // store type, you can choose 'web', 'terminal', or 'file'
    'options': {
      // store options (required for 'web', and 'file')
      'port': 8080, // port (required for 'web'),
      // 'dest': path.resolve('qr.png'), // destination (required for 'file')
    },
  },
  'prefixes': ['.'], // Prefixes for the commands
  'sessionPath': new SessionManager('sessions', 'folder'), // Setup your session
};
