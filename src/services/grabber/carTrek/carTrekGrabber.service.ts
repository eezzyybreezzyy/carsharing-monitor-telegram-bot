import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICarTrekAPIResponse} from '../../../models/apiResponses/ICarTrekAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {apiUrl} from '../config';
import {toCommonCars} from './utils';

export class CarTrekGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor(private carsharing: string) {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICarTrekAPIResponse>(apiUrl[this.carsharing])
            .map(resp => toCommonCars(this.carsharing, resp.cars));
    }
}
