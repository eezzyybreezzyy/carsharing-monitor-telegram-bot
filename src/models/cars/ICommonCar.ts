import {IGeolocation} from 'models/IGeolocation';

export interface ICommonCar extends IGeolocation {
    id?: number | string;
    company: string;
    model: string;
    regNumber?: string;
    fuel: number | string;
    urlSchema: string;
    distance?: number;
}
