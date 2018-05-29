
import {Observable} from 'rxjs/Rx';
import TelegramBot, {ConstructorOptions, Location} from 'node-telegram-bot-api';

import {GrabberService} from '../services/grabber/grabber.service';
import {PollingService} from '../services/polling/polling.service';

import {ICommonCar} from '../models/cars/ICommonCar';

import {CarsharingMonitorBotUI} from './ui/carsharingMonitorBotUI';
import {parseRadius} from './ui/utils';

interface BotUser {
    state?: string;
    location?: Location;
    poll?: PollingService<ICommonCar[]>;
}

export class CarsharingMonitorBot {
    private bot: TelegramBot;
    private ui: CarsharingMonitorBotUI;
    private grabber: GrabberService;
    private users: {[id: number]: BotUser} = {};
    
    constructor(token: string, options?: ConstructorOptions) {
        this.bot = new TelegramBot(token, options);
        this.ui = new CarsharingMonitorBotUI(this.bot);
        this.grabber = new GrabberService(['delimobil', 'youdrive', 'belkacar', 'yandexdrive', 'timcar']);
    }

    start() {
        this.handleStartAndHelpCommand();
        this.handleCityCommand();
        this.handleServicesCommand();
        this.handleModelsCommand();
        this.handleFindNearestCommand();
        this.handleMonitorCommand();

        this.handleRadiusMessage();
        this.handleStopMonitor();
    }

    private handleStartAndHelpCommand() {
        this.bot.onText(/^\/(start|help)/, msg => {
            this.ui.sendGreetings(msg);
        });
    }

    private handleCityCommand() {
        this.bot.onText(/^\/city/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Скоро!');
        });
    }

    private handleServicesCommand() {
        this.bot.onText(/^\/services/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Скоро!');
        });
    }

    private handleModelsCommand() {
        this.bot.onText(/^\/models/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Скоро!');
        });
    }

    private handleFindNearestCommand() {
        this.bot.onText(/^\/find_nearest/, msg => {
            if (this.users[msg.chat.id] && this.users[msg.chat.id].state !== 'S_WAIT_NEW_MONITOR') {
                this.bot.sendMessage(msg.chat.id, 'Нельзя запускать несколько поисков одновременно! Завершите поиск и повторите снова.');

                return;
            }

            if (!this.users[msg.from.id]) {
                this.users[msg.from.id] = {state: 'S_LOCATION_SEND'};
            }

            this.ui.requestUserLocation(msg.chat.id)
                .switchMap(location => this.grabber.getCars(location))
                .subscribe(cars => {
                    this.ui.sendCar(msg.chat.id, cars[0]);
                    this.users[msg.from.id].state = 'S_WAIT_NEW_MONITOR';
                }, err => console.log('Error: ', err));
        });
    }

    private handleMonitorCommand() {
        this.bot.onText(/^\/monitor/, msg => {
            if (this.users[msg.chat.id] && this.users[msg.chat.id].state !== 'S_WAIT_NEW_MONITOR') {
                this.bot.sendMessage(msg.chat.id, 'Нельзя запускать несколько поисков одновременно! Завершите поиск и повторите снова.');

                return;
            }

            if (!this.users[msg.from.id]) {
                this.users[msg.from.id] = {state: 'S_LOCATION_SEND'};
            }

            this.ui.requestUserLocation(msg.chat.id)
                .subscribe(location => {
                    this.users[msg.from.id].state = 'S_RADIUS_ENTER';
                    this.users[msg.from.id].location = location;
                    this.ui.requestSearchRadius(msg);
                });
        });
    }

    private handleRadiusMessage() {
        this.bot.on('text', msg => {
            if (!this.users[msg.chat.id] || this.users[msg.chat.id].state !== 'S_RADIUS_ENTER') {
                return;
            }
    
            const radius = parseRadius(msg.text);
    
            if (!radius) {
                this.bot.sendMessage(msg.chat.id, 'Неверный формат радиуса, повтори еще раз!');
    
                return;
            }
    
            this.monitorCarsInRadius(msg, this.users[msg.from.id].location, radius);
        });
    }

    private handleStopMonitor() {
        this.bot.on('text', msg => {
            if (!this.users[msg.chat.id] || this.users[msg.from.id].state !== 'S_MONITORING') {
                return;
            }
    
            if (msg.text !== 'Прекратить поиск') {
                return;
            } 

            this.users[msg.from.id].poll.stop();
            this.bot.sendMessage(msg.chat.id, 'Ок. Поиск прекращен');
            this.users[msg.from.id].state = 'S_WAIT_NEW_MONITOR';
        }) ;
    }

    private monitorCarsInRadius(message: TelegramBot.Message, userLocation: TelegramBot.Location, radius: number) {
        const stream$ = this.grabber.getCars(userLocation, radius);
        const showed = [];

        this.users[message.from.id].state = 'S_MONITORING';

        this.users[message.from.id].poll = new PollingService<ICommonCar[]>(stream$);
        this.users[message.from.id].poll.start()
            .map(cars => {
                let foundCar: ICommonCar = null;

                cars.some(car => {
                    if (!showed.some(showedCar => showedCar.latitude === car.latitude && showedCar.longitude === car.longitude)) {
                        foundCar = car;

                        return true;
                    }
                });

                return foundCar;
            })
            .filter(car => !!car)
            .subscribe(car => {
                showed.push(car);
                this.ui.sendCar(message.chat.id, car);
            });

        this.ui.requestStopMonitoring(message, radius);
    }
}
