/** @typedef {import('gampang').Client} Client */

import sharp from 'sharp';

/**
 * @param {Client} bot - The client object.
 * @return {Promise<void>}
 */
export default async function ToolCommands(bot) {
  bot.command(
    'toimage',
    async (ctx) => {
      if (!ctx.getReply())
        return ctx.reply(
          'Silahkan reply pesan yang mengandung sticker terlebih dahulu!',
        );
      const sticker = ctx.getReply().sticker;
      if (!sticker) return ctx.reply('Yang anda reply bukanlah sticker!');

      const isGIF = !!ctx.flags.find((f) => f.toLowerCase() === 'gif');
      if (isGIF && !sticker.animated)
        return ctx.reply('Are you trying to convert an image to ' + 'a GIF?');
      try {
        const stickerBuffer = await sticker.retrieveFile('sticker');
        const sharped = sharp(stickerBuffer, {
          animated: sticker.animated,
        });

        if (isGIF) {
          await ctx.replyWithVideo(await sharped.gif().toBuffer());
        } else {
          await ctx.replyWithPhoto(await sharped.png().toBuffer());
        }
      } catch (e) {
        console.log(e);
        await ctx.reply(
          'Something was wrong, try again please?\n' + 'Error: ' + e.message,
        );
      }
    },
    {
      description: 'Convert sticker to image',
      aliases: ['toimg'],
      category: 'Tool',
    },
  );

  bot.command(
    'tosticker',
    async (ctx) => {
      if (!ctx.image)
        return ctx.reply(
          'Silahkan reply pesan yang mengandung gambar terlebih dahulu!',
        );

      try {
        const mediaDecrypted = await ctx.image.retrieveFile();
        const converted = await sharp(mediaDecrypted).webp().toBuffer();

        await ctx.replyWithSticker(converted);
      } catch (e) {
        await ctx.reply(
          'Something was wrong, try again please?\n' + 'Error: ' + e.message,
        );
      }
    },
    {
      description: 'Convert image to sticker',
      aliases: ['tostkr'],
      category: 'Tool',
    },
  );
}
