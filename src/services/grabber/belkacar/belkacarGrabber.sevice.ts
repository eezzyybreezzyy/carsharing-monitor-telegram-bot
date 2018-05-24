import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IBelkaCarAPIResponse} from '../../../models/apiResponses/IBelkaCarAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {apiUrl} from '../config';
import {parsePage, toCommonCars} from './utils';

export class BelkaCarGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IBelkaCarAPIResponse>(apiUrl.belkacar)
            .map(html => parsePage(html))
            .map(cars => toCommonCars(cars));
    }
}
