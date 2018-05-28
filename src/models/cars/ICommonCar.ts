import {IGeolocation} from 'models/IGeolocation';

export interface ICommonCar extends IGeolocation {
    id?: number | string;
    company: string;
    model: string;
    regNumber?: string;
    fuel?: number;
    urlSchema: string;
    distance?: number;
}
