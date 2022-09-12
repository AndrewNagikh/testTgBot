require('@babel/register');

const { Markup } = require('telegraf');

const mainMenu = () => Markup.keyboard([
  ['☀️Погода', '📖 Хочу почитать'],
  ['💬Сделать рассылку'],
]).resize();

module.exports = mainMenu;
