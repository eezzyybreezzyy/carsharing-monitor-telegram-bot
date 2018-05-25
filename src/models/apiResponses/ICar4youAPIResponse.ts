import {ICar4you} from '../cars/ICar4you';

export interface ICar4youAPIResponse {
    success: boolean;
    method: string;
    data: ICar4you[];
}