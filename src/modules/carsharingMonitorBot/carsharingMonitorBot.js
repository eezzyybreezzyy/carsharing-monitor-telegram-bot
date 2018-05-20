const TelegramBot = require('node-telegram-bot-api');
const CarsharingService = require('../../services/carsharing/carsharing.service');

const Geolocation = require('../../models/Geolocation');
const Car = require('../../models/Car');

class CarsharingMonitorBot {
    constructor() {
        this.bot = new TelegramBot(process.env.BOT_TOKEN, {
            polling: true,
            request: {
                proxy: 'http://195.201.52.208:1080'
            }
        });
        this.carsharingService = new CarsharingService();

        // сделать на каждого пользователя отдельно 
        this.interval = null;
        this.paused = false;
        this.canceled = [];
    }

    start() {
        this.bot.onText(/^\/settings/, msg => {
            this.bot.sendMessage(msg.chat.id, 'Пока не доступно:(');
        });

        this.bot.onText(/^\/find_nearest/, msg => {
            this.requestUserLocation(msg.chat.id)
                .then(() => {
                    this.bot.once('location', msg => {
                        const userLocation = new Geolocation(msg.location.latitude, msg.location.longitude);

                        this.showNearestCar(msg.chat.id, userLocation);
                    });
                });
        });

        this.bot.onText(/^\/monitor/, msg => {
            this.requestUserLocation(msg.chat.id)
                .then(() => {
                    this.bot.once('location', msg => {
                        const userLocation = new Geolocation(msg.location.latitude, msg.location.longitude);
                        const radius = 1;

                        this.bot.sendMessage(msg.chat.id, `Начинаю поиск автомобилей в радиусе ${radius}км...`);

                        this.interval = setInterval(() => {
                            if (!this.paused) {
                                this.showCarsInRadius(msg.chat.id, userLocation, radius);
                            }
                        }, 10000);
                    });
                });
        });
    }

    requestUserLocation(chatId) {
        // Обертка для клавы
        const options = {
            parse_mode: 'Markdown',
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{text: 'Отправить', request_location: true}],
                    [{text: 'Отмена'}]
                ]
            }
        };

        return this.bot.sendMessage(chatId, 'Для начала работы нужна ваша геопозиция', options);
    }

    showNearestCar(chatId, userLocation) {
        this.carsharingService.getCars()
            .then(cars => Car.getNearest(cars, userLocation))
            .then(car => {
                const {company, model, distance, fuel, urlSchema, latitude, longitude} = car;
                const distanceText = distance < 1
                                   ? `${distance.toFixed(3) * 1000}м`
                                   : `${distance.toFixed(2)}км`;
                const text = `${company} ${model} находится на расстоянии ${distanceText} от вас.\nДоступно бензина: ${fuel}%.\nПосмотреть в приложении: ${urlSchema}`;

                this.bot.sendLocation(chatId, latitude, longitude)
                    .then(() => {
                        this.bot.sendMessage(chatId, text);
                    });
            })
            .catch(error => console.log(error));
    }

    showCarsInRadius(chatId, userLocation, radius) {
        this.carsharingService.getCars()
            .then(cars => Car.getInRadius(cars, userLocation, radius))
            .then(cars => {
                // убирать из списка авто из cancelled
                cars = cars.filter(car => !this.canceled.some(item => item.latitude === car.latitude && item.longitude === car.longitude));
                return cars.length ? Car.getNearest(cars, userLocation) : null
            })
            .then(car => {
                if (car) {
                    const {company, model, distance, fuel, urlSchema, latitude, longitude} = car;
                    const distanceText = distance < 1
                                   ? `${distance.toFixed(3) * 1000}м`
                                   : `${distance.toFixed(2)}км`;
                    const text = `По вашему запросу найден ${company} ${model}. Находится на расстоянии ${distanceText} от вас.\nДоступно бензина: ${fuel}%.\nПосмотреть в приложении: ${urlSchema}\nПродолжить поиск?`;

                    this.paused = true;

                    const options = {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            one_time_keyboard: true,
                            keyboard: [
                                [{text: 'Да'}],
                                [{text: 'Нет'}]
                            ]
                        }
                    };

                    this.bot.sendLocation(chatId, latitude, longitude)
                        .then(() => this.bot.sendMessage(chatId, text, options))
                        .then(() => {
                            // Если не ответил через 5 секунд то продолжать поиск
                            this.bot.once('text', msg => {
                                switch (msg.text) {
                                    case 'Да':
                                        // выкидывать найденный автомобиль из поиска
                                        // выводить сообщение о продолжении поиска
                                        this.bot.sendMessage(chatId, 'Хорошо, продолжаю поиск...');
                                        this.canceled.push(car);
                                        this.paused = false;
                                        break;
                                    case 'Нет':
                                        // выводить сообщение об окончании поиска
                                        this.bot.sendMessage(chatId, `Поиск завершен! Найдено ${this.canceled.length} автомобилей.`);
                                        this.canceled = [];
                                        clearInterval(this.interval);
                                        break;
                                    default:
                                        break;
                                }
                            });
                        });
                }
            })
            .catch(err => console.log(err));
    }
}

module.exports = CarsharingMonitorBot;
