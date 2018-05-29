import TelegramBot from 'node-telegram-bot-api';
import {Observable, Observer} from 'rxjs/Rx'

import {ICommonCar} from '../../models/cars/ICommonCar';

import {parseRadius, getOptionsForReplyKeyboard, transformCarToText} from './utils';

import apiUrl from '../../config';

export class CarsharingMonitorBotUI {
    constructor(private bot: TelegramBot) {}

    sendGreetings(message: TelegramBot.Message) {
        const text = [];

        text.push(`Приветствую, @${message.from.username}!`);
        text.push('\nЯ бот для поиска и отслеживания каршеринговых автомобилей.')
        text.push('\nЯ умею работать со следующими сервисами:');
        
        Object.keys(apiUrl).sort().forEach((name, index) => {
            text.push(`${index + 1}) ${name}`);
        });

        text.push('\nПонимаю следующие команды:\n');
        text.push('\/find_nearest – находит ближайший к Вам автомобиль');
        text.push('\/monitor – запускает поиск автомобилей в заданном Вами радиусе');

        text.push('\n<b>Фильтры поиска [скоро]</b>');
        text.push('\/city – изменение города поиска')
        text.push('\/services – изменение списка сервисов, среди которых будет производиться поиск');
        text.push('\/models – изменение списка моделей, среди которых будет производиться поиск');

        this.bot.sendMessage(message.chat.id, text.join('\n'), {parse_mode: 'HTML'});
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

    requestSearchRadius(message: TelegramBot.Message) {
        const keyboard = [
            [{text: '500м'}, {text: '750м'}],
            [{text: '1км'}, {text: '1.5км'}],
            [{text: '2км'}, {text: '2.5км'}]
        ];
        const options = getOptionsForReplyKeyboard(keyboard);

        this.bot.sendMessage(message.chat.id, 'Выберите радиус поиска ниже или введите в форматe: число и единица измерения (м или км)', options)
            .catch(err => {
                console.log('Error while send radius request: ', err)
            });
    }

    requestStopMonitoring(message: TelegramBot.Message, radius: number) {
        const keyboard = [
            [{text: 'Прекратить поиск'}]
        ];
        const options = getOptionsForReplyKeyboard(keyboard);

        this.bot.sendMessage(message.chat.id, `Начинаю поиск автомобилей в радиусе ${radius}км...`, options)
            .catch(err => {
                console.log('Error while send stop monitor request: ', err);
            });
    }

    sendCar(chatId: number, car: ICommonCar): Promise<TelegramBot.Message | Error> {
        const text = transformCarToText(car);

        return this.bot.sendLocation(chatId, car.latitude, car.longitude, {disable_notification: true})
            .then(msg => this.bot.sendMessage(chatId, text, {parse_mode: 'HTML'}));
    }
}
