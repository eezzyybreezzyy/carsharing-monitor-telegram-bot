import {ICar4you} from '../../../models/cars/ICar4you';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: ICar4you[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.car4you.name,
            id: car.id,
            model: `${car.vendor} ${car.marka}`,
            regNumber: car.numberplate,
            fuel: `${parseFloat(car.data_fuel).toFixed(0)}%`,
            latitude: parseFloat(car.lat),
            longitude: parseFloat(car.lng),
            urlSchema: `car4you://cars`
        })
    );
}