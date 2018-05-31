import {ICompanyConfig} from './models/config/ICompany';

export const config: ICompanyConfig = {
    anytime: {
        name: 'Anytime',
        cities: ['Москва'],
        api: 'https://app.anytimecar.ru/data/v3.9.5/info'
    },
    belkacar: {
        name: 'BelkaCar',
        cities: ['Москва'],
        api: 'https://belkacar.ru/map'
    },
    car4you: {
        name: 'CAR4YOU',
        cities: ['Москва'],
        // через раз кидает ошибку сети
        api: 'https://crm.car4you.ru/mobile/freereservation'
    },
    car5: {
        name: 'CAR5',
        cities: ['Москва', 'Санкт-Петербург', 'Сочи', 'Новосибирск', 'Краснодар'],
        api: 'https://www.car5.ru/car5/rs/car5.get.list.php'
    },
    carenda: {
        // методы:
        // cars получить все авто (без подробной инфы)
        // car-info?id=${number}
        name: 'Carenda',
        cities: ['Москва'],
        api: 'https://carenda.ru/api/v1'
    },
    timcar: {
        name: 'TimCar',
        cities: ['Москва'],
        api: 'https://service.timcar.ru/api/cars'
    },
    matreshcar: {
        name: 'MatreshCar',
        cities: ['Москва'],
        api: 'https://service.matreshcar.ru/api/cars'
    },
    maturcar: {
        name: 'MaturCar',
        cities: ['Уфа'],
        api: 'https://service.maturcar.ru/api/cars'
    },
    urentcar: {
        name: 'URentCar',
        cities: ['Краснодар', 'Анапа', 'Сочи', 'Кавминводы'],
        api: 'https://service.urentcar.ru/api/cars'
    },
    drivetime: {
        name: 'DriveTime',
        cities: ['Минск'],
        api: 'https://drivetime.cartrek.online/api/cars'
    },
    getmancar: {
        name: 'GetmanCar',
        cities: ['Киев'],
        // выдавал пустой массив хотя в приложении видно машины
        api: 'http://getmancar.cartrek.online/api/cars'
    },
    delimobil: {
        name: 'Делимобиль',
        cities: ['Москва', 'Санкт-Петербург', 'Уфа', 'Нижний Новгород'],
        api: 'https://delimobil.ru/maps-data?action=cars&alias=ru'
    },
    /*
    carusel: {
        name: 'Карусель',
        cities: ['Москва'],
        api: 'https://api.carusel.club/api/car/get-cars'
    },
    */
    lifcar: {
        name: 'Lifcar',
        cities: ['Москва'],
        api: 'https://api.lifcar.ru/api/car/get-cars'
    },
    rentmee: {
        name: 'Rentmee',
        cities: ['Москва', 'Санкт-Петербург'],
        api: 'https://rentmee.club/version3/public/CarListXML.cfm'
    },
    youdrive: {
        name: 'YouDrive',
        cities: ['Москва', 'Санкт-Петербург', 'Сочи'],
        api: 'https://youdrive.today/info?version=2'
    },
    /*
    easyride: {
        name: 'EasyRide',
        cities: ['Москва'],
        // методы:
        // без хедеров: 426 update required, с ними 403 unauthorized
        // cars получить все авто (без подробной инфы)
        // car-info?id=${number}
        api: 'https://easyride.rightech.io/api/v1'
    },
    */
    yandexdrive: {
        name: 'Яндекс.Драйв',
        cities: ['Москва'],
        api: 'https://carsharing.yandex.net/api/drive/v1/cars'
    },
    /*
    colesacom: {
        name: 'Colesa.com',
        cities: ['Санкт-Петербург'],
        api: ''
    },
    */
    
    // carlion, zvezdacar, cars7, mobilecar - оч хз
};
