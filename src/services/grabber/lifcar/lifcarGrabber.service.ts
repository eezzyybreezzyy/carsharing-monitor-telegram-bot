import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ILifCarAPIResponse} from '../../../models/apiResponses/ILifCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {apiUrl} from '../config';
import {toCommonCars} from './utils';

export class LifCarGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ILifCarAPIResponse>(apiUrl.lifcar)
            .map(resp => toCommonCars(resp.data.cars));
    }
}
