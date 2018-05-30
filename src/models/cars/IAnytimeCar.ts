export interface IAnytimeCar {
    id: string;
    vehicle_number: string;
    brand: string;
    color: string;
    engine_volume: string;
    date_of_construction: string;
    hash_id: string;
    type_vehicle: string;
    status: string;
    power: string;
    fuel: number;
    fluid: string;
    exterior: string;
    interior: string;
    address: string;
    tariffs: string;
    current_tariffs: string;
    name: string;
    lng: number;
    lat: number;
    car_type: string;
    cn: string;
    ct: string;
    photos: {
        list: IAnytimePhoto[]
    };
}

export interface IAnytimePhoto {
    s: number;
    u: string;
    w: number;
    h: number;
    d: string;
}