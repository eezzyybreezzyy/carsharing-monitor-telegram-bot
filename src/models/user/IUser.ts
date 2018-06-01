import {IPollingService} from '../polling/IPollingService';
import {IGeolocation} from '../geolocation/IGeolocation';
import {ICommonCar} from '../cars/ICommonCar';

export interface IUser {
    id: number;
    state: string;
    city: string;
    companies: string[];
    models?: string[];
    lastLocation?: IGeolocation;
    poll?: IPollingService<ICommonCar[]>;
}