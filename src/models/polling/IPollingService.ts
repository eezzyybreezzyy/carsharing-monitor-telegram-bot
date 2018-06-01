import {Observable} from 'rxjs/Rx';

export interface IPollingService<T> {
    start(interval: number): Observable<T>;
    stop(): void;
}