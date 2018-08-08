/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const Telegraf = require('telegraf');
const debug = require('debug')('app:bot');
const Processor = require('../services/Processor');

const request = require('request');

module.exports = function (config, DAO) {
  const bot = new Telegraf(process.env.TG_TOKEN || config.bot.token);
  const processor = new Processor(DAO);

  debug(`Bot ${config.bot.name} started`);

  bot.start((ctx) => ctx.reply('Хаю хай!'));
  bot.help((ctx) => ctx.reply("I'm listen for some links"));

  bot.command('anime', (ctx) => {
    const username = ctx.message.text.split('/anime')[1].trim() || 'Mollfar';
    const options = {
      method: 'GET',
      uri: `https://myanimelist.net/animelist/${username}/load.json?status=6`
    };
    console.log(options);
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if(error)
          return reject(error);
        return resolve(JSON.parse(body));
      })
    })
      .then(animes => rand(animes))
      .then(anime => anime ? ctx.reply('https://myanimelist.net' + anime.anime_url) : Promise.reject(new Error('No anime')))
      .catch(err => ctx.replyWithSticker('CAADAgADuAEAAlX9MBF7Rw91QWVXUQI'));
  });

  function rand(items) {
    return items[~~(items.length * Math.random())];
  }

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
