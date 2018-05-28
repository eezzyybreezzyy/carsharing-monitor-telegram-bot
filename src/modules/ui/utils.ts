import {KeyboardButton, SendMessageOptions} from 'node-telegram-bot-api';
import {ICommonCar} from '../../models/cars/ICommonCar';

export function parseRadius(text: string): number {
    if (text.endsWith('км')) {
        return parseFloat(text);
    }

    if (text.endsWith('м') && text.indexOf('к') === -1) {
        return parseFloat(text) / 1000;
    }

    return 1;
}

export function getOptionsForReplyKeyboard(keyboard: KeyboardButton[][]): SendMessageOptions {
    return {
        reply_markup: {
            keyboard,
            one_time_keyboard: true,
            resize_keyboard: true
        }
    };
}

export function transformCarToText(car: ICommonCar): string {
    const {company, model, regNumber, fuel, urlSchema, distance} = car;
    const distanceWithUnits = distance < 1
                       ? (distance * 1000).toFixed(0) + 'м'
                       : distance.toFixed(2) + 'км';
    const text = [];

    text.push(`*${company}*\n`);
    text.push(`*Авто:* ${model}`);
    text.push(`*Расстояние:* ~${distanceWithUnits}`);

    if (regNumber) {
        text.push(`*Госномер:* ${regNumber}`);
    }

    if (fuel) {
        text.push(`*Доступно бензина:* ~${fuel.toFixed(0)}%.`);
    }

    text.push(`*Открыть приложение:* ${urlSchema}.`);

    return text.join('\n');
}