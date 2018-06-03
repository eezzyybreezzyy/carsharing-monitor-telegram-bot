import {IColesacomCar} from '../cars/IColesacomCar';

export interface IColesacomAPIResponse {
    data: IColesacomCar[];
    meta: {
        status: number;
        pagination: {
            [key: string]: number;
        };
    }
}
