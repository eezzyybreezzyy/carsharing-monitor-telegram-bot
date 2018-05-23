import {Observable} from 'rxjs/Rx';
import {DelimobilGrabService} from './delimobil/delimobilGrabber.service';

import {ICommonCar} from '../../models/cars/ICommonCar';

export interface IGrabberService {
    getCars(): Observable<ICommonCar[]>
}

export class GrabberService implements IGrabberService {
    private delimobilGrabService = new DelimobilGrabService();

    getCars(): Observable<ICommonCar[]> {
        return this.delimobilGrabService.getCars();
    }
}