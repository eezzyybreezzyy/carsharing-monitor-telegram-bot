import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ILifCarAPIResponse} from '../../../models/apiResponses/ILifCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

const LIF_CAR_API = 'https://api.lifcar.ru/api/car/get-cars';

// Для Карусели так же
export class LifCarGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ILifCarAPIResponse>(LIF_CAR_API)
            .map(resp => toCommonCars(resp.data.cars));
    }
}
