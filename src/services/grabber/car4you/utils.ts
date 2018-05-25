import {ICar4you} from '../../../models/cars/ICar4you';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: ICar4you[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'Car4You',
            id: car.id,
            model: `${car.vendor} ${car.marka}`,
            regNumber: car.numberplate,
            fuel: car.data_fuel,
            latitude: +car.lat,
            longitude: +car.lng,
            urlSchema: `car4you://cars/${car.id}`
        })
    );
}