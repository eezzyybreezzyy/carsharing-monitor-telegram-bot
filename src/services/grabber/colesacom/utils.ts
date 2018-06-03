import {IColesacomCar} from '../../../models/cars/IColesacomCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: IColesacomCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.colesacom.name,
            id: car.id,
            model: car.name,
            regNumber: car.number,
            fuel: car.fuel_level_percent && `${car.fuel_level_percent.toFixed(0)}%`,
            latitude: car.latitude,
            longitude: car.longitude,
            urlSchema: `colesacom://cars`
        })
    );
}
