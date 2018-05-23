export interface IDelimobilCar {
    type: string;
    id: number;
    model: string;
    reg_number: string;
    fuel: string;
    status: string;
    geometry: {
        type: string;
        coordinates: number[];
    }
}