import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICarendaAPICarsResponse, ICarendaAPICarInfoResponse} from '../../../models/apiResponses/ICarendaAPIResponse';
import {ICarendaCarExtended} from '../../../models/cars/ICarendaCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../../config';

// для easyride
// const options ={
//     headers: {
//         'Host': 'easyride.rightech.io',
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': '*/*',
//         'Connection': 'keep-alive',
//         'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
//         'User-Agent': 'EasyRide/2.11 (ru.cariot.easyride; build:3; iOS 11.4.0) Alamofire/4.6.0',
//         'x-app-version': 'ios/2.11',
//         'Accept-Language': 'ru-RU;q=1.0, en-RU;q=0.9, ja-JP;q=0.8'
//     },
//     auth: {
//         bearer: 'ESzy5N-HLlBPTDxqOqUUpZg6tazCOKAP'
//     }
// };

// объеденить с EasyRide
export class CarendaGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICarendaAPICarsResponse>(`${apiUrl.carenda}/cars`)
            .switchMap(resp => {
                if (!resp.success) {
                    return Observable.throw(this.getErrorText(resp));
                }

                const streams$ = resp.cars.map(car => this.getCar(car.id));

                return Observable.zip<ICarendaCarExtended>(...streams$);
            })
            .map(cars => toCommonCars(cars));
    }

    private getCar(id: string): Observable<ICarendaCarExtended> {
        return this.apiService.get<ICarendaAPICarInfoResponse>(`${apiUrl.carenda}/car-info?id=${id}`)
            .map(resp => resp.car);
    }

    private getErrorText({errorCodes, errorMessages}: ICarendaAPICarsResponse): string {
        return `Errors: ${errorCodes.join(', ')}. ${errorMessages.join(', ')}`
    }
}
