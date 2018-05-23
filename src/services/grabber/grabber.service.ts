import {Observable} from 'rxjs/Rx';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {BelkaCarGrabberService} from './belkacar/belkacarGrabber.sevice';

import {ICommonCar} from '../../models/cars/ICommonCar';

export interface IGrabberMap {
    [carsharing: string]: IGrabberService;
}

export interface IGrabberService {
    getCars(): Observable<ICommonCar[]>
}

export class GrabberService implements IGrabberService {
    private carsharings: string[];
    private grabber: IGrabberMap = {
        delimobil: new DelimobilGrabberService(),
        belkacar: new BelkaCarGrabberService()
    };

    constructor(carsharings = ['delimobil', 'belkacar']) {
        this.carsharings = carsharings;
    }

    getCars(): Observable<ICommonCar[]> {
        const streams$ = this.carsharings.map(name => this.grabber[name].getCars());

        return Observable.zip(...streams$)
            .map(commonCarArrays => Array.prototype.concat.apply([], commonCarArrays));
    }
}