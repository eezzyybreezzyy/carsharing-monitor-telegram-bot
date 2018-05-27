import {CarsharingMonitorBot} from './modules/carsharingMonitorBot';

import {ConstructorOptions} from 'node-telegram-bot-api';
import {Options} from 'request';

const token = process.env.BOT_TOKEN;
const options: ConstructorOptions = {polling: true};
const args = process.argv.slice(2);

switch (args[0]) {
    case 'proxy':
        options.request = {proxy: args[1]} as Options;
        break;
    default: break;
}

const bot = new CarsharingMonitorBot(token, options);

bot.start();
