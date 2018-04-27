/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const Telegraf = require('telegraf');
const debug = require('debug')('app:bot');
const Processor = require('../services/Processor');


module.exports = function (config, DAO) {
  const bot = new Telegraf(process.env.TG_TOKEN || config.bot.token);
  const processor = new Processor(DAO);

  debug(`Bot ${config.bot.name} started`);

  bot.start((ctx) => ctx.reply('Хаю хай!'));
  bot.help((ctx) => ctx.reply("I'm listen for some links"));

  bot.on('sticker', (ctx) => ctx.reply('👍'));

  bot.hears(Processor.LINK_REGEXP, (ctx) => {
    const from = {
      username: ctx.from.username,
      chat: ctx.chat.id
    };
    // return ctx.reply('👍');
    return processor.generateInternalLink(from, ctx.message.text)
       .then(link => ctx.replyWithHTML(`🔥 <a href='${link}'>Here</a> is your link 🔥`));
  });

  bot.startPolling();
};
