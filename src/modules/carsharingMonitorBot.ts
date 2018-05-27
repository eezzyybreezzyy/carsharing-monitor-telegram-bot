
import {Observable} from 'rxjs/Rx';
import TelegramBot, {ConstructorOptions, Location} from 'node-telegram-bot-api';

import {GrabberService} from '../services/grabber/grabber.service';
import {PollingService} from '../services/polling/polling.service';

import {getNearestCar, getCarsInRadius} from '../utils/carGeolocation';

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
        this.grabber = new GrabberService(['delimobil', 'timcar', 'youdrive']);
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
                .subscribe(location => {
                    this.getAndSendNearestCar(msg.chat.id, location);
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

    private getAndSendNearestCar(chatId: number, userLocation: TelegramBot.Location) {
        this.grabber.getCars()
            .map(cars => getNearestCar(cars, userLocation))
            .subscribe(car => {
                this.ui.sendNearestCar(chatId, car);
            });
    }

    private monitorCarsInRadius(chatId: number, userLocation: TelegramBot.Location, radius: number) {
        this.poll = new PollingService<ICommonCar[]>(this.getCarsInRadius.call(this, userLocation, radius));

        this.poll.start()
            .concatMap(cars => cars)
            .subscribe(car => this.ui.sendNearestCar(chatId, car));

        this.ui.requestStopMonitoring(chatId, radius)
            .filter(stop => stop)
            .subscribe(() => {
                this.poll.stop();
                this.bot.sendMessage(chatId, 'Ок. Поиск прекращен');
            });
    }

    private getCarsInRadius(userLocation: TelegramBot.Location, radius: number): Observable<ICommonCar[]> {
        return this.grabber.getCars()
            .map(cars => getCarsInRadius(cars, userLocation, radius));
    }
}
