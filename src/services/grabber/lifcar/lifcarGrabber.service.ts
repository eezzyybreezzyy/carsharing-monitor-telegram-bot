import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ILifCarAPIResponse} from '../../../models/apiResponses/ILifCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import {config} from '../../../config';

// Добавить и объеденить с каруселью
export class LifCarGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ILifCarAPIResponse>(config.lifcar.api)
            .map(resp => toCommonCars(resp.data.cars));
    }
}
