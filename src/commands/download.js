/** @typedef {import('gampang').Client} Client */

import ytdl from 'ytdl-core';
import { Blob } from 'buffer';

/**
 * @param {Client} bot - The client object.
 * @return {Promise<void>}
 */
export default async function DownloadCommands(bot) {
  bot.command(
    'youtube',
    {
      'description': 'Download Youtube Music Or Video.',
      aliases: ['ytdl', 'play'],
      category: 'Download',
    },
    async (ctx) => {
      const [link] = ctx.args;
      const [mediaType] = ctx.flags;
      if (!mediaType && (mediaType != 'mp3' || 'mp4'))
        return ctx.reply('Silahkan tentukan flag media type: --mp3 atau --mp4');
      if (!link || !ytdl.validateURL(link))
        return ctx.reply('Link youtube tidak valid!');
      const infoYtdl = await ytdl.getBasicInfo(link);
      if (infoYtdl.videoDetails.isLiveContent)
        return ctx.reply('Tidak dapat mengunduh video livestream!');
      else if (parseInt(infoYtdl.videoDetails.lengthSeconds) >= 20 * 60)
        return ctx.reply('Durasi video terlalu panjang!');
      ctx.reply(
        `Downloading *${infoYtdl.videoDetails.title}* with duration *${
          infoYtdl.videoDetails.lengthSeconds
        } seconds*\nChannel: *${infoYtdl.videoDetails.author.name}*\nURL: *${
          infoYtdl.videoDetails.video_url
        }*\nDescription:\n\n${infoYtdl.videoDetails.description ?? '-'}`,
      );
      let buffs = Buffer.alloc(0);
      const stream = ytdl(infoYtdl.videoDetails.video_url, {
        quality: 'highest',
        filter: mediaType === 'mp4' ? 'videoandaudio' : 'audioonly',
      });
      stream.on('data', (chunk) => {
        if (new Blob([buffs]).size >= 215000000) {
          stream.destroy();
          ctx.reply('Ukuran file terlalu besar!');
        } else {
          buffs = Buffer.concat([buffs, Buffer.from(chunk)]);
        }
      });
      stream.on('end', () => {
        if (mediaType == 'mp4') {
          ctx.replyWithVideo(
            buffs,
            `Downloaded ${infoYtdl.videoDetails.title} 🎉`,
          );
        } else {
          ctx.replyWithAudio(buffs, true);
        }
      });
      stream.on('error', (err) => {
        if (err.message === 'leaved') {
          ctx.client.logger.warn(
            'YouTube Download for: ' +
              ctx.currentJid() +
              'Terhenti karena bot dikeluarkan dari group!',
          );
        } else {
          ctx.reply('Silahkan coba kembali!');
        }
      });
    },
  );
}
