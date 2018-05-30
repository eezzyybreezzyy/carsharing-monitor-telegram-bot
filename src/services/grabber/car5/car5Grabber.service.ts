import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICar5APIResponse} from '../../../models/apiResponses/ICar5APIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import {config} from '../../../config';

export class Car5GrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICar5APIResponse[]>(config.car5.api)
            .map(resp => toCommonCars(resp[0].data.arrCar));
    }
}
