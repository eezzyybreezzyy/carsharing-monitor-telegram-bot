import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IDelimobilAPIResponse} from '../../../models/apiResponses/IDelimobilAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

const DELIMOBIL_API_URL = 'https://delimobil.ru/maps-data?action=cars&alias=ru';

export class DelimobilGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IDelimobilAPIResponse>(DELIMOBIL_API_URL)
            .map(resp => toCommonCars(resp.features));
    }
}
