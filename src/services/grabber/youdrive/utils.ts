import {IYouDriveCar} from '../../../models/cars/IYouDriveCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: IYouDriveCar[], withoutPartners: boolean = true): ICommonCar[] {
    if (withoutPartners) {
        cars = cars.filter(car => !car.is_parther);
    }

    return cars.map(car =>
        ({
            company: config.youdrive.name,
            model: car.model,
            fuel: car.fuel && `${car.fuel.toFixed(0)}%`,
            latitude: car.latitude,
            longitude: car.longitude,
            urlSchema: 'youdrivetoday://cars'
        })
    );
}
