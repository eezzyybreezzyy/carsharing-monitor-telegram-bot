import {IAnytimeCar} from '../../../models/cars/IAnytimeCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {config} from '../../../config';

export function toCommonCars(cars: {[carId: string]: IAnytimeCar}): ICommonCar[] {
    return Object.keys(cars).map(id =>
        ({
            company: config.anytime.name,
            id: id,
            model: cars[id].name,
            regNumber: cars[id].vehicle_number.toUpperCase(),
            fuel: cars[id].fuel && `${cars[id].fuel.toFixed(0)}%`,
            latitude: cars[id].lat,
            longitude: cars[id].lng,
            urlSchema: `anytimecar://cars/${cars[id].hash_id}/`
        })
    );
}