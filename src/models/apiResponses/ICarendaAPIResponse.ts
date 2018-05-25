import {ICarendaCarShort, ICarendaCarExtended} from '../cars/ICarendaCar';

export interface ICarendaAPICarsResponse {
    cars: ICarendaCarShort[];
    errorCodes?: number[],
    errorMessages?: string[];
    success: boolean;
}

export interface ICarendaAPICarInfoResponse {
    buttons: {[name: string]: string};
    car: ICarendaCarExtended;
    success: boolean;
}
