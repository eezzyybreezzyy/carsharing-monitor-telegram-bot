import {Observable, Subject} from 'rxjs/Rx';

export interface IPollingService {
    start(interval: number): Observable<any>;
    stop(): void;
}

export class PollingService implements IPollingService {
    private stop$: Subject<void>;

    constructor(private observable: Observable<any>) {
        this.observable = observable;
        this.stop$ = new Subject<void>();
    }

    start(interval: number = 500): Observable<any> {
        return this.observable
                   .delay(interval)
                   .repeat()
                   .retry()
                   .takeUntil(this.stop$.asObservable());
    }

    stop() {
        this.stop$.next();
    }
}
