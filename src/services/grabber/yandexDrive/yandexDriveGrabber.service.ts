import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IYandexDriveAPIResponse} from '../../../models/apiResponses/IYandexDriveAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../api/config';

export class YandexDriveGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        const options = {
            headers: {
                'Host': 'carsharing.yandex.net',
                'Lon': '', 
                'Accept': '*/*',
                'Authorization': 'OAuth AQAAAAARjsyKAARoNePbXSkuTkt3rdEuymIM68c',
                'AppVersion': '130.0.0',
                // 'Accept-Encoding': 'br, gzip, deflate',
                'Lat': '',
                'Accept-Language': 'ru',
                'UUID': '57accfaf530ead15b204152e7b5ed9bc',
                'DeviceID': '885FE696-AE82-4471-B076-7718A2A7B479',
                'User-Agent': 'Drive/398 CFNetwork/901.1 Darwin/17.6.0',
                'Connection': 'keep-alive',
                'AppBuild': '398'
            }
        };

        return this.apiService.get<IYandexDriveAPIResponse>(apiUrl.yandexdrive, options)
            .map(resp => toCommonCars(resp.cars));
    }
}
