import {IYandexDriveCar} from '../cars/IYandexDriveCar';

export interface IYandexDriveAPIResponse {
    cars: IYandexDriveCar[];
    server_time: number;
}
