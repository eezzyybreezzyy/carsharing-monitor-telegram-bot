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
// import { PollingService } from "./services/polling/polling.service";
// import { GrabberService } from "./services/grabber/grabber.service";
// import { GrabberServiceFactory } from "./services/grabber/grabber.service.factory";

// const g = new GrabberServiceFactory();
// const grabber = new GrabberService();
// const poll = new PollingService(grabber.getCars());

// poll.start().subscribe(cars => console.log(cars[0]), console.log);

