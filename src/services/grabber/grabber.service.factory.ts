import {AnytimeGrabberService} from './anytime/anytimeGrabber.service';
import {BelkaCarGrabberService} from './belkaCar/belkaCarGrabber.sevice';
import {Car4youGrabberService} from './car4you/car4youGrabber.service';
import {Car5GrabberService} from './car5/car5Grabber.service';
import {CarendaGrabberService} from './carenda/carendaGrabber.service';
import {CarTrekGrabberService} from './carTrek/carTrekGrabber.service';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {LifCarGrabberService} from './lifCar/lifCarGrabber.service';
import {RentmeeGrabberService} from './rentmee/rentmeeGrabber.service';
import {YandexDriveGrabberService} from './yandexDrive/yandexDriveGrabber.service';
import {YouDriveGrabberService} from './youDrive/youDriveGrabber.service';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';

import {config} from '../../config';

export class GrabberServiceFactory implements IGrabberServiceFactory {
    create(name: string): IGrabberService {
        switch (name) {
            case config.anytime.name:
                return new AnytimeGrabberService();
            case config.belkacar.name:
                return new BelkaCarGrabberService();
            case config.car4you.name:
                return new Car4youGrabberService();
            case config.car5.name:
                return new Car5GrabberService();
            case config.carenda.name:
                return new CarendaGrabberService();
            case config.timcar.name:
            case config.matreshcar.name:
            case config.maturcar.name:
            case config.urentcar.name:
            case config.drivetime.name:
            case config.getmancar.name:
                return new CarTrekGrabberService(name);
            case config.delimobil.name:
                return new DelimobilGrabberService();
            case config.lifcar.name:
                return new LifCarGrabberService();
            case config.rentmee.name:
                return new RentmeeGrabberService();
            case config.yandexdrive.name:
                return new YandexDriveGrabberService();
            case config.youdrive.name:
                return new YouDriveGrabberService();
            default: return null;
        }
    }
}
