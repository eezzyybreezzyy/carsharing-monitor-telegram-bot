import {Observable} from 'rxjs/Rx';
import {GrabberServiceFactory} from './grabber.service.factory';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';
import {ICommonCar} from '../../models/cars/ICommonCar';

import apiUrl from '../api/config';

const CARSHARINGS = Object.keys(apiUrl);

export class GrabberService implements IGrabberService {
    private grabberFactory: IGrabberServiceFactory;

    constructor(private carsharings: string[] = CARSHARINGS) {
        this.grabberFactory = new GrabberServiceFactory();
    }

    getCars(): Observable<ICommonCar[]> {
        const streams$ = this.carsharings.map(name => {
            return this.grabberFactory.create(name).getCars()
                       .catch(err => Observable.of(err));
        });

        return Observable.zip<ICommonCar[]>(...streams$)
            .map(arrays => this.handleAndRemoveErrors(arrays))
            .map(arrays => this.concatArrays(arrays));
    }

    private handleAndRemoveErrors(arrays: ICommonCar[][]) {
        return arrays.filter((item, index) => {
            if (item instanceof Array) {
                return item;
            };
            
            console.log(`${this.carsharings[index]}: ${item}`);
        });
    }

    private concatArrays(arrays: ICommonCar[][]): ICommonCar[] {
        return Array.prototype.concat.apply([], arrays);
    }
}
