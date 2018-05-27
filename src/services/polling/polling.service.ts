import {Observable, Subject} from 'rxjs/Rx';

export interface IPollingService<T> {
    start(interval: number): Observable<T>;
    stop(): void;
}

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
