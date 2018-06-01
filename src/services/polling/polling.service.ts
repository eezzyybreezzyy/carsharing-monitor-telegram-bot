import {Observable, Subject} from 'rxjs/Rx';
import {IPollingService} from '../../models/polling/IPollingService';

export class PollingService<T> implements IPollingService<T> {
    private stop$: Subject<void>;

    constructor(private observable: Observable<T>) {}

    start(interval: number = 500): Observable<T> {
        this.stop$ = new Subject<void>();

        return this.observable
                   .delay(interval)
                   .repeat()
                   .retry()
                   .takeUntil(this.stop$.asObservable());
    }

    stop() {
        if (this.stop$) {
            this.stop$.next();
        }
    }
}
