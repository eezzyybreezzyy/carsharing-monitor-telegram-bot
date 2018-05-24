import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IBelkaCarAPIResponse} from '../../../models/apiResponses/IBelkaCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {parsePage, toCommonCars} from './utils';

const BELKA_CAR_API_URL = 'https://belkacar.ru/map';

export class BelkaCarGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IBelkaCarAPIResponse>(BELKA_CAR_API_URL)
            .map(html => parsePage(html))
            .map(cars => toCommonCars(cars));
    }
}
