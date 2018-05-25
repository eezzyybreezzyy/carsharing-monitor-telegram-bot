import {ICar5} from '../cars/ICar5';

export interface ICar5APIResponse {
    errcode: number;
    data: {
        arrCar: ICar5[];
        desktop: string;
        message: string;
    }
}