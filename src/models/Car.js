const Geolocation = require('./Geolocation');

class Car {
    static getNearest(cars, location) {
        const carsWithDistance = cars.map(car => {
            const carLocation = new Geolocation(car.latitude, car.longitude);
            const distance = Geolocation.getDistance(location, carLocation);

            car.distance = distance;
            return car;
        });

        const nearestCar = carsWithDistance.sort(this.comparator)[0];

        return nearestCar;
    }

    static getInRadius(cars, location, radius) {
        const carsInRadius = cars.filter(car => {
            const carLocation = new Geolocation(car.latitude, car.longitude);
            const distance = Geolocation.getDistance(location, carLocation);

            return distance <= radius;
        });

        return carsInRadius;
    }

    static comparator(carA, carB) {
        return carA.distance - carB.distance;
    }
}

module.exports = Car;
