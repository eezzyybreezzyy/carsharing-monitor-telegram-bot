import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';
import {IGrabberService} from '../grabber.service';

import {ICommonCar} from '../../../models/cars/ICommonCar';

import {parsePage, toCommonCars} from './utils';

const BELKA_CAR_API_URL = 'https://belkacar.ru/map';

export class BelkaCarGrabberService {
    private apiService = new APIService();

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<string>(BELKA_CAR_API_URL)
            .map(html => parsePage(html))
            .map(cars => toCommonCars(cars));
    }
}