export interface IYandexDriveCar {
    id: string;
    number: string;
    is_available: boolean;
    cost_per_minute: IYandexDriveCost;
    location: IYandexDriveLocation;
    model: IYandexDriveModel;
    telematics_state: IYandexDriveTelematicsState;
    fuel_card_number: string;
}

export interface IYandexDriveCost {
    carsharing_parking: number;
    carsharing_parking_free_until: number;
    carsharing_ride: number;
}

export interface IYandexDriveLocation {
    course: number;
    lat: number;
    lon: number;
}

export interface IYandexDriveModel {
    code: string;
}

export interface IYandexDriveTelematicsState {
    dipped_beam_on: boolean;
    engine_temperature: number;
    front_left_door_open: boolean;
    front_right_door_open: boolean;
    rear_left_door_open: boolean;
    rear_right_door_open: boolean;
    hood_open: boolean | null;
    trunk_open: boolean;
    fuel_level: number;
    fuel_endurance: number | null;
    hand_brake_on: boolean;
    ignition_on: boolean;
    engine_on: boolean;
    mileage: number;
    transmission_selector_park: boolean;
}
