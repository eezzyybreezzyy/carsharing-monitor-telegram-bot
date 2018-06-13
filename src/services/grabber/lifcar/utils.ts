import {ILifCar} from '../../../models/cars/ILifCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: ILifCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.lifcar.name,
            id: car.id,
            model: `${car.mark} ${car.model}`,
            fuel: car.fuelDistance && `на ${car.fuelDistance.toFixed(1)}км`,
            latitude: car.lat,
            longitude: car.lon,
            urlSchema: `lifcar://cars`
        })
    );
}
