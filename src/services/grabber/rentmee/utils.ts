import {Observable, Observer} from 'rxjs/Rx';

import {IRentmeeCar} from '../../../models/cars/IRentmeeCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {parseString} from 'xml2js';
import {normalize} from 'xml2js/lib/processors';

export function parseXml(xml: string): Observable<IRentmeeCar[]> {
    return Observable.create((observer: Observer<IRentmeeCar[]>) => {
        const options = {
            normalizeTags: true,
            mergeAttrs: true,
            explicitArray: false,
            attrNameProcessors: [normalize]
        };

        parseString(xml, options, (err, result) => {
            if (err) {
                observer.error(err);
            }

            const cars = result.carlist.car instanceof Array
                       ? result.carlist.car
                       : [result.carlist.car];

            observer.next(cars);
        });
    });
}

export function toCommonCars(cars: IRentmeeCar[]): ICommonCar[] {
    return cars.map(car =>
        ({
            company: 'Rentmee',
            id: car.id,
            model: `${car.brand} ${car.model}`,
            fuel: parseFloat(car.fuel),
            latitude: +car.point.lat,
            longitude: +car.point.lng,
            urlSchema: 'rentmee://cars'
        })
    );
}