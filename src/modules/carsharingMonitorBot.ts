
import {Observable} from 'rxjs/Rx';
import TelegramBot, {ConstructorOptions, Location} from 'node-telegram-bot-api';

import {GrabberService} from '../services/grabber/grabber.service';
import {PollingService} from '../services/polling/polling.service';

import {ICommonCar} from '../models/cars/ICommonCar';

import {CarsharingMonitorBotUI} from './ui/carsharingMonitorBotUI';

export class CarsharingMonitorBot {
    private bot: TelegramBot;
    private ui: CarsharingMonitorBotUI;
    private grabber: GrabberService;
    private poll: PollingService<ICommonCar[]>;
    
    constructor(token: string, options?: ConstructorOptions) {
        this.bot = new TelegramBot(token, options);
        this.ui = new CarsharingMonitorBotUI(this.bot);
        this.grabber = new GrabberService();
    }

    start() {
        this.listenStartCommand();
        this.listenSettingsCommand();
        this.listenFindNearestCommand();
        this.listenMonitorCommand();
    }

    private listenStartCommand() {
        this.bot.onText(/^\/start/, msg => {
            this.bot.sendMessage(msg.chat.id, `Приветствую, @${msg.from.username}!`);
        });
    }

    private listenSettingsCommand() {
        this.bot.onText(/^\/settings/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Пока не доступно:(');
        });
    }

    private listenFindNearestCommand() {
        this.bot.onText(/^\/find_nearest/, msg => {
            this.ui.requestUserLocation(msg.chat.id)
                .switchMap(location => this.grabber.getCars(location))
                .subscribe(cars => {
                    this.ui.sendNearestCar(msg.chat.id, cars[0]);
                });
        });
    }

    private listenMonitorCommand() {
        this.bot.onText(/^\/monitor/, ({chat}) => {
            let userLocation;

            this.ui.requestUserLocation(chat.id)
                .switchMap(location => {
                    userLocation = location;

                    return this.ui.requestSearchRadius(chat.id);
                })
                .subscribe(radius => {
                    this.monitorCarsInRadius(chat.id, userLocation, radius);
                });
        });
    }

    private monitorCarsInRadius(chatId: number, userLocation: TelegramBot.Location, radius: number) {
        const stream$ = this.grabber.getCars(userLocation, radius);
        const showed = [];

        this.poll = new PollingService<ICommonCar[]>(stream$);
        this.poll.start()
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
                this.ui.sendNearestCar(chatId, car);
            });

        this.ui.requestStopMonitoring(chatId, radius)
            .filter(stop => stop)
            .subscribe(() => {
                this.poll.stop();
                this.bot.sendMessage(chatId, 'Ок. Поиск прекращен');
            });
    }
}
