import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IYandexDriveAPIResponse} from '../../../models/apiResponses/IYandexDriveAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../../config';

export class YandexDriveGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        const headers = {'Authorization': 'OAuth AQAAAAARjsyKAARoNePbXSkuTkt3rdEuymIM68c'};

        return this.apiService.get<IYandexDriveAPIResponse>(apiUrl.yandexdrive, {headers})
            .map(resp => toCommonCars(resp.cars));
    }
}
