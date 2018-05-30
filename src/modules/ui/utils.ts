import {KeyboardButton, SendMessageOptions} from 'node-telegram-bot-api';
import {ICommonCar} from '../../models/cars/ICommonCar';

export function parseRadius(text: string): number {
    if (text.endsWith('км')) {
        return parseFloat(text);
    }

    if (text.endsWith('м') && text.indexOf('к') === -1) {
        return parseFloat(text) / 1000;
    }

    return null;
}

export function getOptionsForReplyKeyboard(keyboard: KeyboardButton[][], resize: boolean = true): SendMessageOptions {
    return {
        reply_markup: {
            keyboard,
            one_time_keyboard: true,
            resize_keyboard: resize
        }
    };
}

export function transformCarToText(car: ICommonCar): string {
    const {company, model, regNumber, fuel, urlSchema, distance} = car;
    const distanceWithUnits = distance < 1
                       ? (distance * 1000).toFixed(0) + 'м'
                       : distance.toFixed(2) + 'км';
    const text = [];

    text.push(`<b>${company}</b>\n`);
    text.push(`<b>Авто:</b> ${model}`);
    text.push(`<b>Расстояние:</b> ~${distanceWithUnits}`);

    if (regNumber) {
        text.push(`<b>Госномер:</b> ${regNumber}`);
    }

    if (fuel) {
        text.push(`<b>Доступно бензина:</b> ~${fuel.toFixed(0)}%`);
    }

    text.push(`<a href="${urlSchema}">Перейти в приложение</a>`);

    return text.join('\n');
}
