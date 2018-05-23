import {Observable} from 'rxjs/Rx';
import {BelkaCarGrabberService} from './belkacar/belkacarGrabber.sevice';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {LifCarGrabberService} from './lifcar/lifcarGrabber.service';
import {TimCarGrabberService} from './timcar/timcarGrabber.service';
import {YouDriveGrabberService} from './youdrive/youDriveGrabber.service';

import {ICommonCar} from '../../models/cars/ICommonCar';

const CARSHARINGS = ['belkacar', 'delimobil', 'lifcar', 'timcar', 'youdrive'];

export interface IGrabberServiceMap {
    [carsharing: string]: IGrabberService;
}

export interface IGrabberService {
    getCars(): Observable<ICommonCar[]>
}

export class GrabberService implements IGrabberService {
    private grabber: IGrabberServiceMap;

    constructor(private carsharings: string[] = CARSHARINGS) {
        this.grabber = {
            belkacar: new BelkaCarGrabberService(),
            delimobil: new DelimobilGrabberService(),
            lifcar: new LifCarGrabberService(),
            timcar: new TimCarGrabberService(),
            youdrive: new YouDriveGrabberService()
        };
    }

    getCars(): Observable<ICommonCar[]> {
        const streams$ = this.carsharings.map(name => this.grabber[name].getCars());

        return Observable.zip(...streams$)
            .map(commonCarArrays => Array.prototype.concat.apply([], commonCarArrays));
    }
}
