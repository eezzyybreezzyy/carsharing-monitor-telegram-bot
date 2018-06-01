import {IGeolocation} from '../geolocation/IGeolocation';

export interface ICommonCar extends IGeolocation {
    id?: number | string;
    company: string;
    model: string;
    regNumber?: string;
    fuel?: string;
    urlSchema: string;
    distance?: number;
}
