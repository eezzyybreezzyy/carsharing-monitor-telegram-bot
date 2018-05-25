import {BelkaCarGrabberService} from './belkacar/belkacarGrabber.sevice';
import {Car4youGrabberService} from './car4you/car4youGrabber.service';
import {Car5GrabberService} from './car5/car5Grabber.service';
import {CarendaGrabberService} from './carenda/carendaGrabber.service';
import {CarTrekGrabberService} from './carTrek/carTrekGrabber.service';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {LifCarGrabberService} from './lifcar/lifcarGrabber.service';
import {RentmeeGrabberService} from './rentmee/rentmeeGrabber.service';
import {YouDriveGrabberService} from './youdrive/youDriveGrabber.service';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';

export class GrabberServiceFactory implements IGrabberServiceFactory {
    create(name: string): IGrabberService {
        switch (name) {
            case 'belkacar':
                return new BelkaCarGrabberService();
            case 'car4you':
                return new Car4youGrabberService();
            case 'car5':
                return new Car5GrabberService();
            case 'carenda':
                return new CarendaGrabberService();
            case 'timcar':
            case 'matreshcar':
            case 'maturcar':
            case 'urentcar':
            case 'drivetime':
            case 'getmancar':
                return new CarTrekGrabberService(name);
            case 'delimobil':
                return new DelimobilGrabberService();
            case 'lifcar':
                return new LifCarGrabberService();
            case 'rentmee':
                return new RentmeeGrabberService();
            case 'youdrive':
                return new YouDriveGrabberService();
            default: return null;
        }
    }
}