import TelegramBot from 'node-telegram-bot-api';
import {Observable, Observer} from 'rxjs/Rx'

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
        text.push('\/set_city – изменение города поиска (сбросит остальные фильтры) <b>[бета]</b>')
        text.push('\/set_companies – изменение списка компаний, среди которых будет производиться поиск <b>[скоро]</b>');
        text.push('\/set_models – изменение списка моделей авто, среди которых будет производиться поиск <b>[скоро]</b>');
        text.push('\/reset_filters – вернуть настройки по умолчанию (г. Москва, без фильтров) <b>[скоро]</b>');
        text.push('\/settings – вывод установленных фильтров <b>[скоро]</b>');

        this.bot.sendMessage(chatId, text.join('\n'), {parse_mode: 'HTML'});
    }

    requestCity(chatId: number) {
        const keyboard = [
            [...cities.slice(0, 3)],
            [...cities.slice(3, 6)],
            [...cities.slice(6, 9)],
            [...cities.slice(9, cities.length), 'Отменить']
        ];
        const options = getOptionsForReplyKeyboard(keyboard, false);

        this.bot.sendMessage(chatId, 'Выберите город поиска', options);
    }

    requestCompany(chatId: number) {

    }

    requestModel(chatId: number) {
        
    }

    requestUserLocation(chatId: number): Observable<TelegramBot.Location> {
        return Observable.create((observer: Observer<TelegramBot.Location>) => {
            const keyboard = [
                [{text: 'Отправить', request_location: true}]
            ];
            const options = getOptionsForReplyKeyboard(keyboard);

            this.bot.sendMessage(chatId, 'Отправьте мне вашу геопозицию (по кнопке ниже или отправьте сами)', options)
                .then(() => {
                    this.bot.once('location', msg => {
                        observer.next(msg.location);
                        observer.complete();
                    });
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
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

    sendCar(chatId: number, car: ICommonCar) {
        const text = transformCarToText(car);

        this.bot.sendLocation(chatId, car.latitude, car.longitude, {disable_notification: true})
            .then(msg => this.bot.sendMessage(chatId, text, {parse_mode: 'HTML'}))
            .catch(err => console.log('Error: ', err));
    }
}
