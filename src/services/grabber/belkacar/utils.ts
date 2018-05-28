import {IBelkaCar} from '../../../models/cars/IBelkaCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function parsePage(html: string): IBelkaCar[] {
    const re = /carsInfo\[\d+\] = ({.+})\;/g
    const cars = [];
    let match = re.exec(html);

    while (match != null) {
        cars.push(JSON.parse(match[1]));
        match = re.exec(html);
    }

    return cars;
}

export function toCommonCars(cars: IBelkaCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'BelkaCar',
            id: car.id,
            model: car.model,
            // переводить км до заправки в бензин
            fuel: car.no_refill_distance,
            latitude: car.latitude,
            longitude: car.longitude,
            urlSchema: `belkacar://cars`
        })
    );
}
