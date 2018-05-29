import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICar4youAPIResponse} from '../../../models/apiResponses/ICar4youAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../../config';

export class Car4youGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICar4youAPIResponse>(apiUrl.car4you)
            .map(resp => toCommonCars(resp.data));
    }
}
