import {PollingService} from '../polling/polling.service';

import {IUser} from '../../models/user/IUser';
import {IGeolocation} from '../../models/geolocation/IGeolocation';
import {ICommonCar} from '../../models/cars/ICommonCar';

import {getCompaniesFromCity} from '../../modules/utils';

export class User implements IUser {
    id: number;
    state: string = 'S_WAIT_NEW_COMMAND';
    companies: string[];
    models: string[];
    lastLocation?: IGeolocation;
    poll: PollingService<ICommonCar[]>;
    private _city: string = 'Москва';

    constructor(id: number) {
        this.id = id;
        this.companies = getCompaniesFromCity(this.city);
    }

    set city(value: string) {
        this._city = value;
        this.companies = getCompaniesFromCity(value);
    }

    get city(): string {
        return this._city;
    }
}
