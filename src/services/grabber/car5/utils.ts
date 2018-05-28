import {ICar5} from '../../../models/cars/ICar5';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: ICar5[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'Car5',
            id: car.id,
            model: car.name.replace(/<\/?em>/g, ''),
            regNumber: car.gnum.replace(/\s/g, ''),
            fuel: car.fuel1, // fuel в литрах, fuel1 в процентах
            latitude: +car.latitude,
            longitude: +car.longitude,
            urlSchema: `car5://cars`
        })
    );
}