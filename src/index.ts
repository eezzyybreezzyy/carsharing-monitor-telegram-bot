import {CarsharingMonitorBot} from './modules/carsharingMonitorBot';

const bot = new CarsharingMonitorBot(process.env.BOT_TOKEN);

bot.start();

