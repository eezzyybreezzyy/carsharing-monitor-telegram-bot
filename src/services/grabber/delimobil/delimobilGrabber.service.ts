import {Observable} from 'rxjs/Rx';
import {APIService} from '../../api/api.service';

import {IGrabberService} from '../../../models/grabber/IGrabberService';
import {IDelimobilAPIResponse} from '../../../models/apiResponses/IDelimobilAPIResponse';
import {ICommonCar} from '../../../models/cars/ICommonCar';

import {toCommonCars} from './utils';

import apiUrl from '../../../config';

export class DelimobilGrabberService implements IGrabberService {
    private apiService: APIService;

    constructor() {
        this.apiService = APIService.instance();
    }

    getCars(): Observable<ICommonCar[]> {
        return this.apiService.get<IDelimobilAPIResponse>(apiUrl.delimobil)
            .map(resp => toCommonCars(resp.features));
    }
}
