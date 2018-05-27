import TelegramBot from 'node-telegram-bot-api';
import {Observable, Observer} from 'rxjs/Rx'

import {ICommonCar} from '../../models/cars/ICommonCar';

export class CarsharingMonitorBotUI {
    constructor(private bot: TelegramBot) {}

    requestUserLocation(chatId: number): Observable<TelegramBot.Location> {
        return Observable.create((observer: Observer<TelegramBot.Location>) => {
            const keyboard = [
                [{text: 'Отправить', request_location: true}]
            ];
            const options = this.getOptionsForReplyKeyboard(keyboard);

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

    requestSearchRadius(chatId: number): Observable<number> {
        return Observable.create((observer: Observer<number>) => {
            const keyboard = [
                [{text: '500м'}, {text: '750м'}],
                [{text: '1км'}, {text: '1.5км'}],
                [{text: '2км'}, {text: '2.5км'}]
            ];
            const options = this.getOptionsForReplyKeyboard(keyboard);

            this.bot.sendMessage(chatId, 'Выберите радиус поиска ниже или введите в форматe: число и единица измерения (м или км)', options)
                .then(() => {
                    this.bot.once('text', msg => {
                        const radius = this.parseRadius(msg.text);
                        
                        observer.next(radius);
                        observer.complete();
                    });
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    requestStopMonitoring(chatId: number, radius: number): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            const keyboard = [
                [{text: 'Прекратить поиск'}]
            ];
            const options = this.getOptionsForReplyKeyboard(keyboard);

            this.bot.sendMessage(chatId, `Начинаю поиск автомобилей в радиусе ${radius}км...`, options)
                .then(() => {
                    this.bot.on('text', msg => {
                        if (msg.text === 'Прекратить поиск') {
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }

                        observer.complete();
                    });
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    sendNearestCar(chatId: number, car: ICommonCar): Promise<TelegramBot.Message | Error> {
        const text = this.getFoundCarText(car);
        
        return this.bot.sendLocation(chatId, car.latitude, car.longitude)
            .then(() => this.bot.sendMessage(chatId, text));
    }

    private getOptionsForReplyKeyboard(keyboard: TelegramBot.KeyboardButton[][]): TelegramBot.SendMessageOptions {
        return {
            reply_markup: {
                keyboard,
                one_time_keyboard: true,
                resize_keyboard: true
            }
        };
    }

    private parseRadius(text: string): number {
        if (text.endsWith('км')) {
            return parseFloat(text);
        }

        if (text.endsWith('м') && text.indexOf('к') === -1) {
            return parseFloat(text) / 1000;
        }

        return 1;
    }

    private getFoundCarText(car: ICommonCar): string {
        const {company, model, distance, fuel, urlSchema, latitude, longitude} = car;
        const distanceText = distance < 1
                           ? `${(distance * 1000).toFixed(0)}м`
                           : `${distance.toFixed(2)}км`;
        const text = `${company} ${model} ~ ${distanceText} от вас.\nДоступно бензина: ${fuel}%.\nПосмотреть в приложении: ${urlSchema}`;
        
        return text;
    }
}
