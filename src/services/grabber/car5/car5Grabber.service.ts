import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICar5APIResponse} from '../../../models/apiResponses/ICar5APIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {apiUrl} from '../config';
import {toCommonCars} from './utils';

export class Car5GrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICar5APIResponse[]>(apiUrl.car5)
            .map(resp => toCommonCars(resp[0].data.arrCar));
    }
}
