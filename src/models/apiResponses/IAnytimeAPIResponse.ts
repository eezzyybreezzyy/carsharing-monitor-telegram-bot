import {IAnytimeCar} from '../cars/IAnytimeCar';

export interface IAnytimeAPIResponse {
    status: boolean;
    data: {
        lang: string;
        languages: {
            [lang: string]: string;
        };
        client: boolean;
        car_items: {
            [carId: string]: IAnytimeCar;
        };
        rentmee: {
            cars: any[]
        };
        cartypes: {
            [type: string]: IAnytimeCarType;
        };
        gas_stations: IAnytimeGasStation[];
        address: boolean;
        short_news_limit: number;
        metro_lines: {
            [id: string]: string;
        };
        metro: IAnytimeMetro[];
        i18n: IAnytimeI18n;
        pages: {
            [name: string]: IAnytimePage;
        };
        price_types: {
            [id: string]: IAnytimePriceType;
        };
        rent_options: {
            [name: string]: IAnytimeRentOption;
        };
        stat: {
            [statName: string]: string;
        };
    };
}

export interface IAnytimeCarType {
    name: string;
    show: string;
    amount: number;
    nearest: number;
    tariffs?: string;
    current_tariffs?: string;
    cn: string;
    car_type: string;
    brand?: string;
    spec?: {
        [specName: string]: {name: string;};
    };
    rent_options?: string;
}

export interface IAnytimeGasStation {
    station_id: string;
    name: string;
    address: string;
    coords: string;
}

export interface IAnytimeMetro {
    name: string;
    coords: string;
    line: string;
}

export interface IAnytimeI18n {
    NeedFuel: string;
    ExternalCarNotFound: string;
    parking: {[key: string]: string};
    statuses: {[key: string]: string};
    near_metro: {[key: string]: string};
    update_require: string;
    pay_title: string;
    menu: string;
    min: string;
    h: string;
    just_updated: string;
    lastupdate: string;
    sec_ago: string;
    min_ago: string;
    hours_ago: string;
    min_on_foot: string;
    show_nearest_car: string;
    of: string;
    needauth: string;
    redirecting: string;
    more: string;
    carinfo_more: string;
    ptr: {[key: string]: string};
    car_status: {[key: string]: string};
    months: {[key: string]: string};
    birth_months: {[key: string]: string};
    settings: {[key: string]: string};
    form: {[key: string]: string};
    carinfo: {[key: string]: string};
    mapsettings: {[key: string]: string};
    cars_by_metro: {[key: string]: string};
    carslist: {[key: string]: string};
    confirm: {[key: string]: string};
    auth: {[key: string]: string};
    account: {[key: string]: string};
    change_info: {[key: string]: string};
    docs: {[key: string]: string};
    payment_types: {[key: string]: string};
    carmanage: {[key: string]: string};
    join: {[key: string]: string};
    agreement: {[key: string]: string};
    route: {[key: string]: string};
    rent_report: {[key: string]: string};
    mycars: {[key: string]: string};
    car_search: {[key: string]: string};
    close_rent: {[key: string]: string};
    home_guest: {[key: string]: string};
    home_auth: {[key: string]: string};
    _v: string;
    files_ver: number;
}

export interface IAnytimePage {
    title?: string;
    name: string;
    show: number;
    type: string;
    content?: string;
    sub?: {
        [name: string]: IAnytimePage;
    };
}

export interface IAnytimePriceType {
    name: string;
    simple_name: string;
    price: number | string;
    notice: string;
    desc: string;
}

export interface IAnytimeRentOption {
    name: string;
    notice: string;
    desc: string;
}