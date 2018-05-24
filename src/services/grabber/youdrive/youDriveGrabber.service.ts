import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IYouDriveAPIResponse} from '../../../models/apiResponses/IYouDriveAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {apiUrl} from '../config';
import {toCommonCars} from './utils';

export class YouDriveGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IYouDriveAPIResponse>(apiUrl.youdrive)
            .map(resp => toCommonCars(resp.cars));
    }
}
