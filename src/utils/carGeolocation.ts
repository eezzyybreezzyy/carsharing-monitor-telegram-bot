import {ICommonCar} from '../models/cars/ICommonCar';
import {IGeolocation} from '../models/IGeolocation';

const EARTH_RADIUS = 6378.137;
const DEG_IN_RAD = Math.PI / 180;

function getDistance(A: IGeolocation, B: IGeolocation): number {
    const dLat = (B.latitude - A.latitude) * DEG_IN_RAD;
    const dLon = (B.longitude - A.longitude) * DEG_IN_RAD;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(A.latitude * DEG_IN_RAD) * Math.cos(B.latitude * DEG_IN_RAD) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 2 * EARTH_RADIUS * c;
}

function comparator(carA: ICommonCar, carB: ICommonCar): number {
    return carA.distance - carB.distance;
}

export function getNearestCar(cars: ICommonCar[], location: IGeolocation) {
    const carsWithDistance = cars.map(car => {
        car.distance = getDistance(location, car);

        return car;
    });

    const nearestCar = carsWithDistance.sort(comparator)[0];

    return nearestCar;
}

export function getCarsInRadius(cars: ICommonCar[], location: IGeolocation, radius: number) {
    return cars.filter(car => {
        const distance = getDistance(location, car);

        car.distance = distance;

        return distance <= radius
    });
}
