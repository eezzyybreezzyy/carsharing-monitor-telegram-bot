import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICarendaAPICarsResponse, ICarendaAPICarInfoResponse} from '../../../models/apiResponses/ICarendaAPIResponse';
import {ICarendaCarExtended} from '../../../models/cars/ICarendaCar';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../api/config';

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
