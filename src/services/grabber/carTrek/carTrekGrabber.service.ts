import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {ICarTrekAPIResponse} from '../../../models/apiResponses/ICarTrekAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

export const apiUrl = {
    timcar: 'https://service.timcar.ru/api/cars', // Москва
    matreshcar: 'https://service.matreshcar.ru/api/cars', // Москва
    maturcar: 'https://service.maturcar.ru/api/cars', // Уфа
    urentcar: 'https://service.urentcar.ru/api/cars', // Сочи (Краснодарский край)
    drivetime: 'https://drivetime.cartrek.online/api/cars', // Минск
    getmancar: 'http://getmancar.cartrek.online/api/cars' // Киев
};

export class CarTrekGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor(private carsharing: string) {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<ICarTrekAPIResponse>(apiUrl[this.carsharing])
            .map(resp => toCommonCars(this.carsharing, resp.cars));
    }
}
