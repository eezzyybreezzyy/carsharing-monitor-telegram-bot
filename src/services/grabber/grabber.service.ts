import {Observable} from 'rxjs/Rx';
import {GrabberServiceFactory} from './grabberServiceFactory';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';
import {ICommonCar} from '../../models/cars/ICommonCar';

const CARSHARINGS = ['belkacar', 'delimobil', 'lifcar', 'timcar', 'matreshcar', 'maturcar', 'urentcar', 'drivetime', 'getmancar', 'youdrive'];

export class GrabberService implements IGrabberService {
    private grabberFactory: IGrabberServiceFactory;

    constructor(private carsharings: string[] = CARSHARINGS) {
        this.grabberFactory = new GrabberServiceFactory();
    }

    getCars(): Observable<ICommonCar[]> {
        const streams$ = this.carsharings.map(name => {
            return this.grabberFactory.create(name).getCars();
        });

        return Observable.zip(...streams$)
            .map(commonCarArrays => Array.prototype.concat.apply([], commonCarArrays));
    }
}
