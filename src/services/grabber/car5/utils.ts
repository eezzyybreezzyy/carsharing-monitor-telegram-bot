import {ICar5} from '../../../models/cars/ICar5';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: ICar5[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.car5.name,
            id: car.id,
            model: car.name.replace(/<\/?em>/g, ''),
            regNumber: car.gnum.replace(/\s/g, ''),
            fuel: `${car.fuel1}%`,
            latitude: +car.latitude,
            longitude: +car.longitude,
            urlSchema: `car5://cars`
        })
    );
}