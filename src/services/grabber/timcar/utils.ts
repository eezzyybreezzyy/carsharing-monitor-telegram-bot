import {ITimCar} from '../../../models/cars/ITimCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: ITimCar[]): ICommonCar[] {
    // часть данных (RegNumber, FuelLevel) не приходят, хотя видна на сайте
    return cars.map(car =>
        ({
            company: 'TimCar',
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
