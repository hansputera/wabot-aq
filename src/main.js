import { Client } from 'gampang';
import config from '../config';

const bot = new Client(config.sessionPath, {
  'qr': config.qr,
  'prefixes': config.prefixes,
});

bot.on('ready', () => {
  bot.logger.info('Bot is ready to use!');
  bot.logger.info('Logged in as: ' + bot.raw.user.name || bot.raw.user.id);
});

bot.command(
  'ping',
  {
    'aliases': ['pong', 'pung'],
    'description': 'Ping the bot',
  },
  async (ctx) => {
    await ctx.reply('Pong!');
  },
);

bot.launch();
