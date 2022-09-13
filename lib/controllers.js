require('@babel/register');

const { Markup } = require('telegraf');

const mainMenu = () => Markup.keyboard([
  ['☀️Погода', '📖 Хочу почитать'],
  ['💬Сделать рассылку'],
  ['Прощай'],
]).resize();

const stopMenu = () => Markup.keyboard([
  ['/start'],
]).resize();

const sendMenu = () => Markup.inlineKeyboard([
  { text: 'Уверен', callback_data: 'yes' },
  { text: 'Отмена', callback_data: 'no' },
]).resize();

const broadcast = (bot, users) => {
  bot.on('text', (ctx) => {
    users.forEach((user) => {
      console.log(user.tg_id);
      ctx.telegram.sendMessage(user.tg_id, ctx.message.text);
    });
    ctx.reply('Сообщения успешно отправлено всем пользователям чата');
  });
};

module.exports = {
  mainMenu, stopMenu, sendMenu, broadcast,
};
