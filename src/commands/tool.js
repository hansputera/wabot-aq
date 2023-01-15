/** @typedef {import('gampang').Client} Client */

import sharp from 'sharp';
import { fetch, validateURL } from "../util";

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
      const image = ctx.getReply().image
      if (!image)
        return ctx.reply(
          'Silahkan reply pesan yang mengandung gambar terlebih dahulu!',
        );

      try {
        const mediaDecrypted = await image.retrieveFile('image');
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

  bot.command(
    'TsToWs',
    async (ctx) => {
      let input = ctx.args
      if (input.length) {
        input = input[0]
        const isUrl = validateURL(input)
        if (isUrl && input.startsWith("https://t.me/addstickers/")) {
          input = input.slice(25, input.length)
        }
        try {
          const hasil = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${input}`);
          for (let i = 0; i < hasil.result.stickers.length; i++) {
              const fileId = hasil.result.stickers[i].thumb.file_id;
              const path = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`);
              ctx.replyWithSticker(`https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${path.result.file_path}`, { isAnimated: path.result.file_path.split(".")[1] === "webm" })
          }
        } catch(e) {
          console.log(e);
          ctx.reply("Maaf, terjadi kesalahan")
        }
      } else {
        ctx.reply("Silahkan kirim link sticker telegram atau nama stickernya!")
      }
    }
  )
}
