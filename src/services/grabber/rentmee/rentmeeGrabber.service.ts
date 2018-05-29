import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IRentmeeAPIResponse} from '../../../models/apiResponses/IRentmeeAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {parseXml, toCommonCars} from './utils';

import apiUrl from '../../../config';

export class RentmeeGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IRentmeeAPIResponse>(apiUrl.rentmee)
            .switchMap(xml => parseXml(xml))
            .map(cars => toCommonCars(cars));
    }
}
