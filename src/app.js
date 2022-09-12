/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { Telegraf } = require('telegraf');
const { User } = require('../db/models');
const mainMenu = require('../lib/keyboard');

const { sequelize } = require('../db/models');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT, TELEGRAM_TOKEN } = process.env;
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  const { username, id, first_name } = ctx.message.from;
  try {
    await User.create({ username, tg_id: id });
    ctx.reply('Здравствуйте, нажмите на любую интересующую вас кнопку', mainMenu());
  } catch (error) {
    console.log(error.message);
    ctx.reply(`Привет ${first_name}`, mainMenu());
  }
});

bot.launch();

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой установлено!');
  } catch (err) {
    console.log(err, 'Error!');
  }
  console.log(`Сервер поднят на ${PORT} порту!`);
});
