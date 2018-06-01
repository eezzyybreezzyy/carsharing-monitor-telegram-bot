import {IGeolocation} from '../geolocation/IGeolocation';

export interface IBelkaCar extends IGeolocation {
    id: number;
    no_refill_distance: number;
    driving_price: 8;
    parking_price: 2;
    model: string;
    type: string;
};