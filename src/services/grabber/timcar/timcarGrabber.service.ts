import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';
import {IGrabberService} from '../grabber.service';

import {ITimCarAPIResponse} from '../../../models/apiResponses/ITimCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

const TIM_CAR_API = 'https://service.timcar.ru/api/cars';

export class TimCarGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ITimCarAPIResponse>(TIM_CAR_API)
            .map(resp => toCommonCars(resp.cars));
    }
}
