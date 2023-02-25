const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();
console.log(process.env.API_KEY);
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
const axios = require('axios');
console.log('bot launch');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  // dapatkan waktu saat pesan diterima
  const now = new Date();
  const hour = now.getHours();

  let timeOfDay;

  // tentukan kondisi "pagi", "siang", atau "malam" tergantung pada waktu saat pesan diterima
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'pagi';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = 'siang';
  } else {
    timeOfDay = 'malam';
  }

  ctx.reply(`Halo, selamat ${timeOfDay}! ${ctx.from.username}`);
});
// handler untuk mengirim teks masukan pengguna ke API ChatGPT
bot.on('text', async (ctx) => {
  const userInput = ctx.message.text;
  // buat permintaan HTTP ke endpoint API ChatGPT
  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: userInput,
    max_tokens: 50,
    n: 1,
    stop: '\n',
  });

  // ambil teks balasan dari respons API
  // const botResponse = response.data.generated_text;
  // console.log(completion.data.choices[0].text);
  const botResponse = completion.data.choices[0].text;
  // kirim teks balasan dari API ke pengguna
  ctx.reply(botResponse);
  console.log(completion.data.choices[0]);
});

bot.launch();
