import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';
import {IGrabberService} from '../grabber.service';

import {IDelimobilAPIResponse} from '../../../models/apiResponses/IDelimobilAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

const DELIMOBIL_API_URL = 'https://delimobil.ru/maps-data?action=cars&alias=ru';

export class DelimobilGrabberService implements IGrabberService {
    private apiService = new APIService();

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IDelimobilAPIResponse>(DELIMOBIL_API_URL)
            .map(resp => toCommonCars(resp.features));
    }
}