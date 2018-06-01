import {IDelimobilCar} from '../../../models/cars/IDelimobilCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: IDelimobilCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.delimobil.name,
            id: car.id,
            model: car.model,
            regNumber: car.reg_number,
            fuel: `${parseFloat(car.fuel).toFixed(0)}%`,
            latitude: car.geometry.coordinates[1],
            longitude: car.geometry.coordinates[0],
            urlSchema: `delimobil://cars`
        })
    );
}