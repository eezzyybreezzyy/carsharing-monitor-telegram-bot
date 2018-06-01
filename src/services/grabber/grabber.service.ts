import {Observable} from 'rxjs/Rx';
import {GrabberServiceFactory} from './grabber.service.factory';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';
import {ICommonCar} from '../../models/cars/ICommonCar';
import {IGeolocation} from '../../models/geolocation/IGeolocation';

import {concatArrays} from '../../utils/concatArrays';
import {getCarsInRadius, getNearestCars} from '../../utils/carGeolocation';

export class GrabberService {
    private grabberFactory: IGrabberServiceFactory;
    private _companies: string[];

    constructor() {
        this.grabberFactory = new GrabberServiceFactory();
    }

    set companies(value: string[]) {
        this._companies = value;
    }

    getCars(location: IGeolocation, radius?: number): Observable<ICommonCar[]> {
        const streams$ = this._companies.map(name => {
            return this.grabberFactory.create(name).getCars()
                       .catch(err => Observable.of(err));
        });

        return Observable.zip<ICommonCar[]>(...streams$)
            .map(arrays => this.handleAndRemoveErrors(arrays))
            .map(arrays => concatArrays(arrays))
            .map(cars => {
                return radius
                     ? getCarsInRadius(cars, location, radius)
                     : getNearestCars(cars, location);
            });
    }

    private handleAndRemoveErrors(arrays: ICommonCar[][]) {
        return arrays.filter((item, index) => {
            if (item instanceof Array) {
                return item;
            };

            console.log(`${this._companies[index]}: ${item}`);
        });
    }
}
