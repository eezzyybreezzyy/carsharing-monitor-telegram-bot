import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';
import {IGrabberService} from '../grabber.service';

import {IYouDriveAPIResponse} from '../../../models/apiResponses/IYouDriveAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

const YOU_DRIVE_API_URL = 'https://youdrive.today/info';

export class YouDriveGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IYouDriveAPIResponse>(YOU_DRIVE_API_URL)
            .map(resp => toCommonCars(resp.cars));
    }
}
