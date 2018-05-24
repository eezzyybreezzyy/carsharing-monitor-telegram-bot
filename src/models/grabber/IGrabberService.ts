import {Observable} from 'rxjs/Rx';
import {ICommonCar} from '../../models/cars/ICommonCar';

export interface IGrabberService {
    getCars(): Observable<ICommonCar[]>
}