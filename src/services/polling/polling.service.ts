import {Observable, Subject} from 'rxjs/Rx';

export interface IPollingService {
    start(observable: Observable<any>, interval: number): Observable<any>;
    stop(): void;
}

export class PollingService implements IPollingService {
    private stop$ = new Subject<void>();

    /*
    start(callback: () => Observable<any>, interval: number): Observable<any> {
        return Observable.timer(0, interval)
                         .switchMap(callback)
                         .takeUntil(this.stop$.asObservable());
    }
    */

    start(observable: Observable<any>, interval: number = 500): Observable<any> {
        return observable
            .delay(interval)
            .repeat()
            .retry()
            .takeUntil(this.stop$.asObservable());
    }

    stop() {
        this.stop$.next();
    }
}