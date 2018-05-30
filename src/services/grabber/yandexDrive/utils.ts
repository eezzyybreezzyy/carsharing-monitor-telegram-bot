import {IYandexDriveCar} from '../../../models/cars/IYandexDriveCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

function normalize(str: string) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function toCommonCars(cars: IYandexDriveCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.yandexdrive.name,
            id: car.id,
            model: normalize(car.model.code.replace('_', ' ')),
            regNumber: car.number.toUpperCase(),
            fuel: car.telematics_state.fuel_level,
            latitude: car.location.lat,
            longitude: car.location.lon,
            urlSchema: `yandexdrive://cars`
        })
    );
}
