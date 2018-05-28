import {ICarendaCarExtended} from '../../../models/cars/ICarendaCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

export function toCommonCars(cars: ICarendaCarExtended[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'Carenda',
            id: car.id,
            model: car.model.name_full,
            regNumber: car.number,
            fuel: parseFloat(car.fuel), // в литрах
            latitude: car.lat,
            longitude: car.lon,
            urlSchema: `carenda://cars`
        })
    );
}