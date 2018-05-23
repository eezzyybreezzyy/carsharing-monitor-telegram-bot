import {IDelimobilCar} from 'models/cars/IDelimobilCar';

export interface IDelimobilAPIResponse {
    type: string;
    features: IDelimobilCar[];
}