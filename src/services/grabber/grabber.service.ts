import {Observable} from 'rxjs/Rx';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {BelkaCarGrabberService} from './belkacar/belkacarGrabber.sevice';

import {ICommonCar} from '../../models/cars/ICommonCar';

export interface IGrabberService {
    getCars(): Observable<ICommonCar[]>
}

export class GrabberService implements IGrabberService {
    private delimobilGrabberService = new DelimobilGrabberService();
    private belkaCarGrabberService = new BelkaCarGrabberService();

    getCars(): Observable<ICommonCar[]> {
        const delimobil$ = this.delimobilGrabberService.getCars();
        const belka$ = this.belkaCarGrabberService.getCars();

        return Observable.zip(delimobil$, belka$)
            .map(commonCarArrays => Array.prototype.concat.apply([], commonCarArrays));
    }
}