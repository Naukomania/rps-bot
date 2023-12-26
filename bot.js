require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const emoji = {
  камень: "🧱",
  бумага: "📃",
  ножницы: "✂️",
};

let score1 = 0; // очки бота
let score2 = 0; // очки пользователя

const game = ["камень", "ножницы", "бумага"];

const showButtons = (chatId) => {
  bot.sendMessage(chatId, "Давай сыграем", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🧱 Камень",
            callback_data: "камень",
          },
          {
            text: "✂️ Ножницы",
            callback_data: "ножницы",
          },
          {
            text: "📃 Бумага",
            callback_data: "бумага",
          },
        ],
      ],
    },
  });
};

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const word = query.data;

    const index = Math.floor(Math.random() * game.length);
    const botWord = game[index];
    const messages = [];

    messages.push(`Ты выбрал: ${word} ${emoji[word]}`);
    messages.push(`Я выбрал: ${botWord} ${emoji[botWord]}`);
    if (botWord === word) {
      messages.push("Ничья");
    } else if (
      ["камень бумага", "бумага ножницы", "ножницы камень"].includes(
        `${word} ${botWord}`
      )
    ) {
      messages.push("Я выиграл");
      score1 += 1;
    } else {
      messages.push("Я проиграл");
      score2 += 1;
    }
    messages.push(`Счёт ${score2}:${score1}`);
    bot.sendMessage(chatId, messages.join("\n")).then(() => {
      showButtons(chatId);
    });
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/start/, (msg) => {
  score1 = 0;
  score2 = 0;
  showButtons(msg.chat.id);
});

// Запуск бота
bot.on("polling_error", console.log);
