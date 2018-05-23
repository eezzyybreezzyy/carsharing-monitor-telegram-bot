import {IGeolocation} from 'models/IGeolocation';

export interface ICommonCar extends IGeolocation {
    id?: number;
    company: string;
    model: string;
    regNumber?: string;
    fuel: string;
    urlSchema: string;
    distance?: number;
}