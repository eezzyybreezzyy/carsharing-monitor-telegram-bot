import {ICarendaCarExtended} from '../../../models/cars/ICarendaCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: ICarendaCarExtended[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: config.carenda.name,
            id: car.id,
            model: car.model.name_full,
            regNumber: car.number,
            fuel: car.fuel && `${parseFloat(car.fuel).toFixed(0)}л`,
            latitude: car.lat,
            longitude: car.lon,
            urlSchema: `carenda://cars`
        })
    );
}