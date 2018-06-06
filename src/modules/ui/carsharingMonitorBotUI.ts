import TinyURL from 'tinyurl';
import TelegramBot from 'node-telegram-bot-api';

import {ICommonCar} from '../../models/cars/ICommonCar';

import {companies, cities} from '../utils';
import {getOptionsForReplyKeyboard, transformCarToText} from './utils';

export class CarsharingMonitorBotUI {
    constructor(private bot: TelegramBot) {}

    sendGreetings(chatId: number, username: string) {
        const text = [];

        text.push(`Приветствую, @${username}!`);
        text.push('\nЯ бот для поиска и отслеживания каршеринговых автомобилей.')
        text.push('\nЯ умею работать со следующими сервисами:');

        companies.forEach((company, index) => {
            text.push(`${index + 1}) ${company}`);
        });

        text.push('\nЯ понимаю следующие команды:\n');
        text.push('\/find_nearest – находит ближайший к Вам автомобиль');
        text.push('\/monitor – запускает поиск автомобилей в заданном Вами радиусе');

        text.push('\n<b>Фильтры поиска</b>');
        text.push('\/set_city – изменение города поиска (сбросит остальные фильтры)')
        text.push('\/set_companies – изменение списка компаний, среди которых будет производиться поиск (cбросит предыдущий фильтр)');
        text.push('\/set_models – изменение списка моделей авто, среди которых будет производиться поиск <b>[скоро]</b>');
        text.push('\/reset_filters – вернуть настройки по умолчанию (г. Москва, без фильтров)');
        text.push('\/settings – вывод установленных фильтров');

        this.bot.sendMessage(chatId, text.join('\n'), {parse_mode: 'HTML'});
    }

    sendFilters(chatId: number, cityFilter: string, companiesFilter: string[]) {
        const text = [];

        text.push(`Вы находитесь в городе ${cityFilter}.\n`);
        text.push('Ищу автомобили следующих каршеринговых компаний:');

        companiesFilter.forEach((company, index) => {
            text.push(`${index + 1}) ${company}`);
        });

        this.bot.sendMessage(chatId, text.join('\n'));
    }

    requestCity(chatId: number) {
        const keyboard = [
            [...cities.slice(0, 3)],
            [...cities.slice(3, 6)],
            [...cities.slice(6, 9)],
            [...cities.slice(9, cities.length), 'Отменить']
        ];
        const options = getOptionsForReplyKeyboard(keyboard, false, false);

        this.bot.sendMessage(chatId, 'Выберите город поиска', options);
    }

    requestCompanies(chatId: number, searchCompanies: string[]) {
        let keyboard = [];

        if (searchCompanies.length === 12) {
            keyboard = [
                [...searchCompanies.slice(0, 3)],
                [...searchCompanies.slice(3, 6)],
                [...searchCompanies.slice(6, 9)],
                [...searchCompanies.slice(9, 12)],
                ['Закончить']
            ];
        }

        if (searchCompanies.length === 5) {
            keyboard = [
                [...searchCompanies.slice(0, 2)],
                [...searchCompanies.slice(2, 4)],
                [...searchCompanies.slice(4, 5), 'Закончить']
            ];
        }

        if (searchCompanies.length === 3) {
            keyboard = [
                [...searchCompanies.slice(0, 2)],
                [...searchCompanies.slice(2, 3), 'Закончить']
            ];
        }

        if (searchCompanies.length === 2) {
            keyboard = [
                [...searchCompanies.slice(0, 1)],
                ['Закончить']
            ];
        }

        const options = getOptionsForReplyKeyboard(keyboard, false, false);

        this.bot.sendMessage(chatId, 'Выберите компании, среди которых я буду искать.', options);
    }

    requestModels(chatId: number) {

    }

    requestUserLocation(chatId: number) {
        const keyboard = [
            [{text: 'Отправить', request_location: true}]
        ];
        const options = getOptionsForReplyKeyboard(keyboard);

        this.bot.sendMessage(chatId, 'Отправьте мне вашу геопозицию (по кнопке ниже или отправьте сами)', options)
    }

    requestSearchRadius(chatId: number) {
        const keyboard = [
            [{text: '500м'}, {text: '750м'}],
            [{text: '1км'}, {text: '1.5км'}],
            [{text: '2км'}, {text: '2.5км'}]
        ];
        const options = getOptionsForReplyKeyboard(keyboard);

        this.bot.sendMessage(chatId, 'Выберите радиус поиска ниже или введите в форматe: число и единица измерения (м или км)', options);
    }

    requestStopMonitoring(chatId: number, radius: number) {
        const keyboard = [
            [{text: 'Прекратить поиск'}]
        ];
        const options = getOptionsForReplyKeyboard(keyboard);

        this.bot.sendMessage(chatId, `Начинаю поиск автомобилей в радиусе ${radius}км...`, options);
    }

    sendCar(chatId: number, car: ICommonCar, closeKeyboard: boolean = false) {
        const text = transformCarToText(car);
        const locationSendOptions: TelegramBot.SendMessageOptions = {
            disable_notification: true
        };
        const carSendOprions: TelegramBot.SendMessageOptions = {
            parse_mode: 'HTML'
        };

        if (closeKeyboard) {
            locationSendOptions.reply_markup = {remove_keyboard: true};
        }

        TinyURL.shorten(car.urlSchema, shortUrl => {
            if (shortUrl) {
                carSendOprions.reply_markup = {
                    inline_keyboard: [
                        [{text: 'Перейти в приложение', url: shortUrl}]
                    ]
                };
            }

            this.bot.sendLocation(chatId, car.latitude, car.longitude, locationSendOptions)
                .then(msg => this.bot.sendMessage(chatId, text, carSendOprions))
                .catch(err => console.log('Error: ', err));
        });
    }
}
