import {Observable} from 'rxjs/Rx';
import TelegramBot, {ConstructorOptions, Location} from 'node-telegram-bot-api';

import {UsersService} from '../services/users/users.service';
import {GrabberService} from '../services/grabber/grabber.service';
import {PollingService} from '../services/polling/polling.service';

import {ICommonCar} from '../models/cars/ICommonCar';

import {CarsharingMonitorBotUI} from './ui/carsharingMonitorBotUI';
import {parseRadius} from './ui/utils';

import {cities, companies, getCompaniesFromCity} from './utils';
import {areCarsEqual} from '../utils/carGeolocation';

const bannedCommands = [
    '\/set_city',
    '\/set_companies',
    '\/set_models',
    '\/find_nearest',
    '\/monitor'
];

export class CarsharingMonitorBot {
    private bot: TelegramBot;
    private ui: CarsharingMonitorBotUI;
    private usersService: UsersService;
    private grabber: GrabberService;

    constructor(token: string, options?: ConstructorOptions) {
        this.bot = new TelegramBot(token, options);

        this.ui = new CarsharingMonitorBotUI(this.bot);
        this.usersService = new UsersService();
        this.grabber = new GrabberService();
    }

    start() {
        this.commandsHandler();
        this.messagesHandler();

        this.debug();
    }

    private commandsHandler() {
        this.handleStartAndHelpCommand();

        this.handleSetCityCommand();
        this.handleSetCompaniesCommand();
        this.handleSetModelsCommand();
        this.handleResetFiltersCommand();
        this.handleSettingsCommand();

        this.handleFindNearestCommand();
        this.handleMonitorCommand();
    }

    private messagesHandler() {
        this.handleCityMessage();
        this.handleCompaniesMessage();

        this.handleLocationForFindNearestMessage();
        this.handleLocationForMonitorMessage()
        this.handleRadiusMessage();
        this.handleStopMonitorMessage();
    }

    private handleStartAndHelpCommand() {
        this.bot.onText(/^\/(start|help)/, msg => {
            this.ui.sendGreetings(msg.chat.id, msg.from.username);
        });
    }

    private handleSetCityCommand() {
        this.bot.onText(/^\/set_city/, msg => {
            const user = this.usersService.getUserById(msg.from.id);

            if (user.state !== 'S_WAIT_NEW_COMMAND') {
                return;
            }

            user.state = 'S_CITY_SET';

            this.ui.requestCity(msg.chat.id);
        });
    }

    private handleSetCompaniesCommand() {
        this.bot.onText(/^\/set_companies/, msg => {
            const user = this.usersService.getUserById(msg.from.id);

            if (user.state !== 'S_WAIT_NEW_COMMAND') {
                return;
            }

            if (user.companies.length === 1) {
                this.bot.sendMessage(msg.chat.id, `В городе ${user.city} доступен только ${user.companies[0]}.`);

                return;
            }

            user.state = 'S_COMPANY_SET';
            this.ui.requestCompanies(msg.chat.id, getCompaniesFromCity(user.city));
            user.companies = [];
        });
    }

    private handleSetModelsCommand() {
        this.bot.onText(/^\/set_models/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Скоро!');
        });
    }

    private handleResetFiltersCommand() {
        this.bot.onText(/^\/reset_filters/, msg => {
            const user = this.usersService.getUserById(msg.from.id);

            user.city = 'Москва';
            this.bot.sendMessage(msg.chat.id, 'Фильтры сброшены!');
        });
    }

    private handleSettingsCommand() {
        this.bot.onText(/^\/settings/, msg => {
            const user = this.usersService.getUserById(msg.from.id);

            this.ui.sendFilters(msg.chat.id, user.city, user.companies);
        });
    }

    private handleFindNearestCommand() {
        this.bot.onText(/^\/find_nearest/, msg => {
            const user = this.usersService.getUserById(msg.from.id);
            const options = {reply_markup: {remove_keyboard: true}};

            if (user.state === 'S_MONITORING') {
                this.bot.sendMessage(msg.chat.id, 'Нельзя запускать несколько поисков одновременно! Завершите поиск и повторите снова.');

                return;
            }

            if (user.state !== 'S_WAIT_NEW_COMMAND') {
                return;
            }

            if (!user.companies.length) {
                this.bot.sendMessage(msg.chat.id, 'Не указаны компании для поиска, выберите их, используя команду \/set_companies');

                return;
            }

            user.state = 'S_LOCATION_SEND_FOR_FIND_NEAREST';

            this.ui.requestUserLocation(msg.chat.id);
        });
    }

    private handleMonitorCommand() {
        this.bot.onText(/^\/monitor/, msg => {
            const user = this.usersService.getUserById(msg.from.id);

            if (user.state === 'S_MONITORING') {
                this.bot.sendMessage(msg.chat.id, 'Нельзя запускать несколько поисков одновременно! Завершите поиск и повторите снова.');

                return;
            }

            if (user.state !== 'S_WAIT_NEW_COMMAND') {
                return;
            }


            if (!user.companies.length) {
                this.bot.sendMessage(msg.chat.id, 'Не указаны компании для поиска, выберите их, используя команду \/set_companies');

                return;
            }

            user.state = 'S_LOCATION_SEND_FOR_MONITOR';

            this.ui.requestUserLocation(msg.chat.id);
        });
    }

    private handleCityMessage() {
        this.bot.on('text', msg => {
            const user = this.usersService.getUserById(msg.from.id);
            const options = {reply_markup: {remove_keyboard: true}};

            if (user.state !== 'S_CITY_SET') {
                return;
            }

            if (bannedCommands.some(command => msg.text === command)) {
                this.bot.sendMessage(msg.chat.id, 'Прежде чем запустить эту команду, завершите выбор города');

                return;
            }

            if (msg.text === 'Отменить') {
                this.bot.sendMessage(msg.chat.id, `Ок. Команда отменена. По прежнему ищу автомобили в городе ${user.city}.`, options);
                user.state = 'S_WAIT_NEW_COMMAND';

                return;
            }

            if (!cities.some(city => city === msg.text)) {
                this.bot.sendMessage(msg.chat.id, 'Не знаю такого города, повторите еще раз!');

                return;
            }

            user.city = msg.text;
            user.state = 'S_WAIT_NEW_COMMAND';
            this.bot.sendMessage(msg.chat.id, `Ок. Теперь буду искать автомобили в городе ${user.city}.`, options);
        });
    }

    private handleCompaniesMessage() {
        this.bot.on('text', msg => {
            const user = this.usersService.getUserById(msg.from.id);
            const options = {reply_markup: {remove_keyboard: true}};

            if (user.state !== 'S_COMPANY_SET') {
                return;
            }

            if (bannedCommands.some(command => msg.text === command)) {
                this.bot.sendMessage(msg.chat.id, 'Прежде чем запустить эту команду, завершите выбор компаний');

                return;
            }

            if (msg.text === 'Закончить') {
                if (!user.companies.length) {
                    this.bot.sendMessage(msg.chat.id, 'Выберите хотя бы одну компанию!');

                    return;
                }

                this.bot.sendMessage(msg.chat.id, `Ок. Теперь буду искать автомобили cледующих компаний: ${user.companies.join(', ')}.`, options);
                user.state = 'S_WAIT_NEW_COMMAND';

                return;
            }

            if (!companies.some(company => company === msg.text)) {
                this.bot.sendMessage(msg.chat.id, 'Не знаю такой компании, повторите еще раз!');

                return;
            }

            user.companies.push(msg.text);
            this.bot.sendMessage(msg.chat.id, `Вы выбрали компанию «${msg.text}». Выберите следующую или нажмите «Закончить».`);
        });
    }

    private handleLocationForFindNearestMessage() {
        this.bot.on('location', msg => {
            const user = this.usersService.getUserById(msg.from.id);
            const options = {reply_markup: {remove_keyboard: true}};

            if (user.state !== 'S_LOCATION_SEND_FOR_FIND_NEAREST') {
                return;
            }

            this.grabber.companies = user.companies;

            this.grabber.getCars(msg.location)
                .subscribe(cars => {
                    if (!cars.length) {
                        this.bot.sendMessage(msg.chat.id, 'К сожалению, не удалось ничего найти :(', options);
                    } else {
                        this.ui.sendCar(msg.chat.id, cars[0], true);
                    }

                    user.state = 'S_WAIT_NEW_COMMAND';
                });
        });
    }

    private handleLocationForMonitorMessage() {
        this.bot.on('location', msg => {
            const user = this.usersService.getUserById(msg.from.id);

            if (user.state !== 'S_LOCATION_SEND_FOR_MONITOR') {
                return;
            }

            user.state = 'S_RADIUS_ENTER';
            user.lastLocation = msg.location;
            this.ui.requestSearchRadius(msg.chat.id);
        });
    }

    private handleRadiusMessage() {
        this.bot.on('text', msg => {
            const user = this.usersService.getUserById(msg.from.id);

            if (user.state !== 'S_RADIUS_ENTER') {
                return;
            }

            if (bannedCommands.some(command => msg.text === command)) {
                this.bot.sendMessage(msg.chat.id, 'Прежде чем запустить эту команду, завершите ввод радиуса');

                return;
            }

            const radius = parseRadius(msg.text);

            if (!radius) {
                this.bot.sendMessage(msg.chat.id, 'Не понимаю формат радиуса, повторите еще раз!');

                return;
            }

            this.monitorCarsInRadius(msg, radius);
        });
    }

    private handleStopMonitorMessage() {
        this.bot.on('text', msg => {
            const user = this.usersService.getUserById(msg.from.id);
            const options = {reply_markup: {remove_keyboard: true}};

            if (user.state !== 'S_MONITORING') {
                return;
            }

            if (bannedCommands.some(command => msg.text === command)) {
                this.bot.sendMessage(msg.chat.id, 'Прежде чем запустить эту команду, завершите поиск');

                return;
            }

            if (msg.text !== 'Прекратить поиск') {
                return;
            }

            user.poll.stop();
            this.bot.sendMessage(msg.chat.id, 'Ок. Поиск прекращен', options);
            user.state = 'S_WAIT_NEW_COMMAND';
        }) ;
    }

    private monitorCarsInRadius(message: TelegramBot.Message, radius: number) {
        const user = this.usersService.getUserById(message.chat.id);

        this.grabber.companies = user.companies;

        const stream$ = this.grabber.getCars(user.lastLocation, radius);
        const showed: {car: ICommonCar; locationMsgId?: number; carMsgId?: number}[] = [];
        let foundCar: ICommonCar = null;

        user.state = 'S_MONITORING';

        user.poll = new PollingService<ICommonCar[]>(stream$);
        user.poll.start()
            .do(cars => this.handleBookedCars(message.chat.id, cars, showed))
            .map(cars => this.getUnshowedCar(cars, showed))
            .filter(car => !!car)
            .switchMap(car => {
                foundCar = car;

                return Observable.fromPromise(this.ui.sendCar(message.chat.id, car));
            })
            .subscribe(({locationMsgId, carMsgId}) => {
                showed.push({car: foundCar, locationMsgId, carMsgId});
            }, err => {
                console.log(err);
                showed.push({car: foundCar});
            });

        this.ui.requestStopMonitoring(message.chat.id, radius);
    }

    private handleBookedCars(chatId: number, cars: ICommonCar[], showed: {car: ICommonCar; locationMsgId?: number; carMsgId?: number}[]) {
        const bookedCars: ICommonCar[] = [];

        showed.forEach(item => {
            if (!cars.some(car => areCarsEqual(car, item.car))) {
                bookedCars.push(item.car);
            }
        });

        bookedCars.forEach(bookedCar => {
            const index = showed.findIndex(item => areCarsEqual(item.car, bookedCar));

            if (!showed[index].locationMsgId || !showed[index].carMsgId) {
                console.log('failure: ', bookedCar);
                return;
            }

            console.log('success: ', bookedCar);

            this.ui.deleteCar(chatId, showed[index].car, showed[index].locationMsgId, showed[index].carMsgId);
            showed.splice(index, 1);
        });
    }

    private getUnshowedCar(cars: ICommonCar[], showed: {car: ICommonCar; locationMsgId?: number; carMsgId?: number}[]): ICommonCar {
        let foundCar: ICommonCar = null;

        cars.some(car => {
            if (!showed.some(item => areCarsEqual(item.car, car))) {
                foundCar = car;

                return true;
            }
        });

        return foundCar;
    }

    private debug() {
        this.bot.on('message', msg => {
            const user = this.usersService.getUserById(msg.from.id);

            console.log(msg.from.username, user.state, user.city, user.companies);
        });
    }
}
