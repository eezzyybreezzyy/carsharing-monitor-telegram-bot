import {Observable} from 'rxjs/Rx';
import {GrabberServiceFactory} from './grabber.service.factory';

import {IGrabberService} from '../../models/grabber/IGrabberService';
import {IGrabberServiceFactory} from '../../models/grabber/IGrabberServiceFactory';
import {ICommonCar} from '../../models/cars/ICommonCar';

const CARSHARINGS = ['belkacar', 'delimobil', 'lifcar', 'timcar', 'matreshcar', 'maturcar', 'urentcar', 'drivetime', 'getmancar', 'youdrive'];

export class GrabberService implements IGrabberService {
    private grabberFactory: IGrabberServiceFactory;

    constructor(private carsharings: string[] = CARSHARINGS) {
        this.grabberFactory = new GrabberServiceFactory();
    }

    getCars(): Observable<ICommonCar[]> {
        const streams$ = this.carsharings.map(name => {
            return this.grabberFactory.create(name).getCars()
                       .catch(err => Observable.of(err));
        });

        // теперь если один из наблюдателей упадет, zip не упадет (для поллинга актуально)
        // но значение упавшего вернет ошибку из APIService
        // TODO: отфильтровать commonCarArrays здесь или в самом боте (мб сообщать юзеру)
        return Observable.zip(...streams$)
            .map(commonCarArrays => Array.prototype.concat.apply([], commonCarArrays));
    }
}
