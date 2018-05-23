import {IGeolocation} from '../IGeolocation';

export interface IYouDriveCar extends IGeolocation {
    pin_img: string;
    color: string;
    model: string;
    img: string;
    transmission: string;
    fuel: number;
    discount: number;
    is_parther: boolean;
}
