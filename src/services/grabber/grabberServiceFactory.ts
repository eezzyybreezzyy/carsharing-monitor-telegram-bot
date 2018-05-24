import {BelkaCarGrabberService} from './belkacar/belkacarGrabber.sevice';
import {CarTrekGrabberService} from './carTrek/carTrekGrabber.service';
import {DelimobilGrabberService} from './delimobil/delimobilGrabber.service';
import {LifCarGrabberService} from './lifcar/lifcarGrabber.service';
import {YouDriveGrabberService} from './youdrive/youDriveGrabber.service';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';

export class GrabberServiceFactory implements IGrabberServiceFactory {
    create(name: string): IGrabberService {
        switch (name) {
            case 'belkacar':
                return new BelkaCarGrabberService();
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
            case 'youdrive':
                return new YouDriveGrabberService();
            default: return null;
        }
    }
}