import {IDelimobilCar} from '../../../models/cars/IDelimobilCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function delimobilCarsToCommonCars(cars: IDelimobilCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'Делимобиль',
            id: car.id,
            model: car.model,
            regNumber: car.reg_number,
            fuel: car.fuel,
            latitude: car.geometry.coordinates[1],
            longitude: car.geometry.coordinates[0],
            urlSchema: `delimobil://cars/${car.id}`
        })
    );
}