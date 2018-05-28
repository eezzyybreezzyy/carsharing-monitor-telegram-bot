import {ILifCar} from '../../../models/cars/ILifCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: ILifCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'LifCar',
            id: car.id,
            model: `${car.mark} ${car.model}`,
            fuel: car.fuel,
            latitude: car.lat,
            longitude: car.lon,
            urlSchema: `lifcar://cars`
        })
    );
}
