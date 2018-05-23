import {ILifCar} from '../cars/ILifCar';

export interface ILifCarAPIResponse {
    success: boolean;
    data: {
        cars: ILifCar[];
    }
}
