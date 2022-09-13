/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { Telegraf } = require('telegraf');
const { User } = require('../db/models');
const {
  mainMenu, stopMenu, sendMenu, broadcast,
} = require('../lib/controllers');

const { sequelize } = require('../db/models');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT, TELEGRAM_TOKEN, WEATHER_API_KEY } = process.env;
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  const { first_name } = ctx.message.from;
  try {
    await User.create({ username: first_name, tg_id: ctx.chat.id });
    ctx.reply('Здравствуйте, нажмите на любую интересующую вас кнопку', mainMenu());
  } catch (error) {
    ctx.reply('Вы уже используете бота', mainMenu());
  }
});

bot.hears('Прощай', async (ctx) => {
  const { id } = ctx.message.from;
  ctx.reply('Пока Пока', stopMenu());
  await User.destroy({ where: { tg_id: id } });
});

bot.hears('☀️Погода', async (ctx) => {
  const canadaWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Canada&appid=${WEATHER_API_KEY}`);
  const canadaWeatherRes = await canadaWeather.json();
  const weather = {};
  if (canadaWeather.status === 200) {
    weather.country = canadaWeatherRes.name;
    weather.sky = canadaWeatherRes.weather[0].main;
    weather.temp = (canadaWeatherRes.main.temp - 273.15).toFixed(2);
    weather.tempFeels = (canadaWeatherRes.main.feels_like - 273.15).toFixed(2);
    ctx.reply(`Weather in ${weather.country}\n${weather.sky} sky\nTemperature ${weather.temp}°C, feels like ${weather.tempFeels}°C`);
  }
});

bot.hears('📖 Хочу почитать', async (ctx) => {
  ctx.sendPhoto('https://pythonist.ru/wp-content/uploads/2020/03/photo_2021-02-03_10-47-04-350x2000-1.jpg', { caption: 'Идеальный карманный справочник для быстрого ознакомления с особенностями работы разработчиков на Python. Вы найдете море краткой информации о типах и операторах в Python, именах специальных методов, встроенных функциях, исключениях и других часто используемых стандартных модулях' });
  ctx.replyWithDocument({
    url: 'https://drive.google.com/file/d/1Xs_YjOLgigsuKl17mOnR_488MdEKloCD/view',
    filename: 'file.zip',
  });
});

bot.hears('💬Сделать рассылку', async (ctx) => {
  ctx.reply('Вы выбрали рассылку всем пользователям. Вы уверен что хотите это сделать?', sendMenu());
});

bot.action(['yes', 'no'], async (ctx) => {
  if (ctx.callbackQuery.data === 'yes') {
    ctx.editMessageText('Введите сообщение, которое хотите отправить всем пользователям');
    const users = await User.findAll({ raw: true });
    broadcast(bot, users);
  }
  if (ctx.callbackQuery.data === 'no') {
    ctx.deleteMessage();
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
