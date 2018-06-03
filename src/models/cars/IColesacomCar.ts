import {IGeolocation} from '../geolocation/IGeolocation';

export interface IColesacomCar extends IGeolocation {
    object: string;
    id: number;
    number: string;
    name: string;
    audio: boolean;
    conditioner: boolean;
    current_booking_status: string;
    distance: number;
    fuel_level_liter: number;
    fuel_level_percent: number;
    condition_comment: string;
    address: string;
    color: IColesacomCarColor;
    car_model: IColesacomCarModel;
    car_condition: IColesacomCarCondition;
}

export interface IColesacomCarColor {
    object: string;
    name: string;
    value: string;
}

export interface IColesacomCarModel {
    object: string;
    audio: boolean;
    conditioner: boolean;
    wifi: boolean;
    capacity: number;
    car_price_tiers: IColesacomCarPriceTier[];
    car_prices: IColesacomCarPrices;
    door_count: number;
    images: IColesacomCarImage[];
    name: string;
    tank_capacity: number;
    wheel_drive_type: string;
}

export interface IColesacomCarCondition {
    object: string;
    hood_cleanness: number;
    hood_comment: string;
    saloon_cleanness: number;
    saloon_comment: string;
}

export interface IColesacomCarPriceTier extends IColesacomCarPrices {
    kind: string;
    kind_display_name: string;
    distance_discounts: IColesacomDistanceDiscount[];
}

export interface IColesacomDistanceDiscount {
    object: string;
    kilometer_threshold: number;
    price: IColesacomMoney;
}

export interface IColesacomCarPrices {
    object: string;
    daily_rate: IColesacomMoney;
    day_per_minute: IColesacomMoney;
    day_per_minute_wait: IColesacomMoney;
    night_per_minute: IColesacomMoney;
    night_per_minute_wait: IColesacomMoney;
    per_kilometer: IColesacomMoney;
}

export interface IColesacomMoney {
    object: string;
    amount: number;
    currency: string;
    formatted: string;
}

export interface IColesacomCarImage {
    object: string;
    usr: string;
    versions: {
        filter_thumb: string;
        source_image: string;
    };
}
