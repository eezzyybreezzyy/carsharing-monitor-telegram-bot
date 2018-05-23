import {IYouDriveCar} from '../../../models/cars/IYouDriveCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: IYouDriveCar[], withoutPartners: boolean = true): ICommonCar[] {
    if (withoutPartners) {
        cars = cars.filter(car => !car.is_parther);
    }

    return cars.map(car =>
        ({
            company: 'YouDrive',
            model: car.model,
            fuel: car.fuel,
            latitude: car.latitude,
            longitude: car.longitude,
            urlSchema: 'youdrivetoday://cars'
        })
    );
}
