export interface ICarTrekCar {
    Id: string;
    Color: string;
    RegNumber: string;
    Cdi: string;
    Vin: string;
    Lat: number;
    Lon: number;
    FuelLevel: number;
    Distance: number;
    CarModel: ICarTrekModel;
    ModelId: string;
    ModelImageId: string;
    Brand: string;
    Model: string;
    TransmissionType: number;
    Discount: number;
    Rate: ICarTrekRate;
}

export interface ICarTrekModel {
    Id: string
    Brand: string;
    ModelName: string;
    AppCardImageId: string;
    CarModelType: number;
    TankCapacity: number;
    FuelConsumptionPer100km: number;
    RangeOnBattery: number;
    TransmissionType: number;
    Class: number;
    SeatsNumber: number;
    Keywords: string[];
    ModelImageId: string;
    MapMarkerIcon: string;
    MapMarkerIconId: string;
}

export interface ICarTrekRate {
    ParkPrice: number;
    DrivePrice: number;
}
