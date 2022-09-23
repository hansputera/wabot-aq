import { Client } from 'gampang';
import path from 'node:path';

import config from '../config';
import { Loader } from './loader';
const bot = new Client(config.sessionPath, {
  'qr': config.qr,
  'prefixes': config.prefixes,
});

const loader = new Loader(bot, path.resolve(__dirname, 'commands'));

bot.on('ready', () => {
  bot.logger.info('Bot is ready to use!');
  bot.logger.info('Logged in as: ' + bot.raw.user.name || bot.raw.user.id);
});

bot.launch().then(() => loader.load());
