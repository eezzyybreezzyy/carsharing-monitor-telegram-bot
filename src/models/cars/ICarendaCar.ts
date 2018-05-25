export interface ICarendaCarShort {
    id: string;
    lat: string;
    lon: string;
}

export interface ICarendaCarExtended {
    id: number;
    number: string;
    status: string;
    lat: number;
    lon: number;
    fuel: string;
    tariff: ICarendaTariff;
    model: ICarendaModel;
}

export interface ICarendaModel {
    name: string;
    name_full: string;
    year: number;
    engine_capacity: number;
    engine_power: number;
    transmission: string;
    equipment: string;
    img: string;
    img_thumb: string;
}

export interface ICarendaTariff {
    name: string;
    type: boolean;
    type_name: string;
    trip: string;
    park: string;
    reserve: string;
    day: string;
    comment: string;
}