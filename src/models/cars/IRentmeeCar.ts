export interface IRentmeeCar {
    carid: string;
    id: string;
    state: string;
    brand: string;
    model: string;
    fuel: string;
    washer: string;
    rank_ext: string;
    rank_int: string;
    point: IRentmeePoint;
}

export interface IRentmeePoint {
    dt: string;
    lat: string;
    lng: string;
    alt: string;
    dir: string;
}