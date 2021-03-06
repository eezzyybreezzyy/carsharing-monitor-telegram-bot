import {ICarTrekCar} from '../../../models/cars/ICarTrekCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(company: string, cars: ICarTrekCar[]): ICommonCar[] {
    // часть данных (RegNumber, FuelLevel) не приходят, хотя видна на сайте
    return cars.map(car =>
        ({
            company: config[company].name,
            id: car.Id,
            model: `${car.Brand} ${car.Model}`,
            regNumber: car.RegNumber,
            fuel: car.FuelLevel,
            latitude: car.Lat,
            longitude: car.Lon,
            urlSchema: `timcar://cars/${car.Id}`
        })
    );
}
