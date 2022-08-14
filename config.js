module.exports = {
  'qr': {
    'store': 'web', // store type, you can choose 'web', 'terminal', or 'file'
    'options': {
      // store options (required for 'web', and 'file')
      'port': 8080, // port (required for 'web'),
      // 'dest': 'qr.png', // destination (required for 'file')
    },
  },
  'prefixes': ['.'], // Prefixes for the commands
};
