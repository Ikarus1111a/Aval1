const TelegramBot = require('node-telegram-bot-api');

// chave api
const token = 'chave api aqui';

const bot = new TelegramBot(token, { polling: true });

const emailState = {};

function horarioComercial() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 18;
}

// Quando o bot recebe uma mensagem
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const texto = msg.text.toLowerCase();

    if (!emailState[chatId]) {
        emailState[chatId] = { awaitingEmail: false, awaitingConfirmation: false };
    }

    if (horarioComercial()) {
        bot.sendMessage(chatId, 'Obrigado pelo contato, aqui está o site: https://uvv.br');
    
    } else {
        if (!emailState[chatId].awaitingEmail && !emailState[chatId].awaitingConfirmation) {
            bot.sendMessage(chatId, 'O horário de funcionamento da empresa é das 09h às 18h.');
            bot.sendMessage(chatId, 'Retorne novamente durante este horário ou deixe seu email para contato:');
            emailState[chatId].awaitingEmail = true;
        } else if (emailState[chatId].awaitingEmail && !emailState[chatId].awaitingConfirmation) {
            bot.sendMessage(chatId, `Você inseriu: ${texto}. Está correto? (sim/não)`);
            emailState[chatId].awaitingConfirmation = true;
        } else if (emailState[chatId].awaitingConfirmation) {
            if (texto === 'sim') {
                bot.sendMessage(chatId, 'Obrigado pelo contato.');
                delete emailState[chatId];
            } else if (texto === 'não') {
                bot.sendMessage(chatId, 'Por favor, insira seu email novamente:');
                emailState[chatId].awaitingEmail = true;
                emailState[chatId].awaitingConfirmation = false;
            }
        }
    }
});
