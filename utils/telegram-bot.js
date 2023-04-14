const { Telegraf } = require('telegraf');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = {
    sendMessage: (message) => {
       bot.telegram.sendMessage(process.env.CHAT_ID, message);
    }
}
